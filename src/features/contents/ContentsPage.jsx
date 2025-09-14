import React, { useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadContents } from "../../slice/contentsSlice";
import Filters from "./Filters";
import ContentCard from "./ContentCard";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import { pricingOptions } from "../../constants/constants";

const PAGE_SIZE = 12;

export default function ContentsPage() {
  const dispatch = useDispatch();
  const loaderRef = useRef();
  const navigate = useNavigate();


  const { items, status } = useSelector((s) => s.contents);
  const [searchParams] = useSearchParams();

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    if (status === "idle") dispatch(loadContents());
  }, [dispatch, status]);

  const pricingParam = searchParams.get("pricing");
  const searchKeyword = searchParams.get("search") || "";

  // Memoized list of selected pricing options from the URL query param.
  // - If no `pricingParam` is present, return an empty array.
  // - Otherwise, split the comma-separated string into an array and
  //   filter out any empty values.
  // Example: "?pricing=Free,Paid" → ["Free", "Paid"]
  const selectedPricing = useMemo(() => {
    if (!pricingParam) return [];
    return pricingParam.split(",").filter(Boolean);
  }, [pricingParam]);

  // Filter items by selected pricing and search keyword (creator or title).
  // Runs whenever items, pricing, or search term changes.
  const filteredItems = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    return items.filter((item) => {
      const filterPrice = pricingOptions
        ?.filter((p) => selectedPricing.includes(p.label))
        .map((p) => p.value) || [];
      if (filterPrice.length > 0) {
        if (!filterPrice.includes(item.pricingOption)) {
          return false;
        }
      }
      if (keyword) {
        const user = (item.creator || "").toLowerCase();
        const title = (item.title || "").toLowerCase();
        if (!user.includes(keyword) && !title.includes(keyword)) {
          return false;
        }
      }

      return true;
    });
  }, [items, selectedPricing, searchKeyword]);

  // Reset visible items and scroll to top whenever filters/search change.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    window.scrollTo(0, 0);
  }, [pricingParam, searchKeyword]);

  // Infinite scroll: observe loader element, load more items when it enters view.
  useEffect(() => {
    const loader = loaderRef.current;
    if (!loader) return;

    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((c) => Math.min(filteredItems.length, c + PAGE_SIZE));
      }
    }, { rootMargin: "200px" });

    obs.observe(loader);
    return () => {
      if (loader) obs.unobserve(loader);
    };
  }, [filteredItems.length, visibleCount]);

  const visibleItems = filteredItems.slice(0, visibleCount);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        CLO-SET CONNECT Store (Assignment)
      </Typography>

      <Filters
        selectedPricing={selectedPricing}
        searchKeyword={searchKeyword}
        onChange={(nextPricing, nextSearch) => {
          const params = {};
          if (nextPricing.length) params.pricing = nextPricing.join(",");
          if (nextSearch) params.search = nextSearch;
          navigate({ search: new URLSearchParams(params).toString() }, { replace: true });
        }}
        onReset={() => navigate({ search: "" }, { replace: true })}
      />

      <Grid container spacing={2}>
        {visibleItems.map((item) => (
          <Grid
            item
            key={item.id}
            size={{ xs: 12, sm: 6, md: 4, lg: 3 }}

          >
            <ContentCard item={item} />
          </Grid>
        ))}
      </Grid>

      {visibleCount < filteredItems.length && (
        <Box ref={loaderRef} sx={{ textAlign: "center", p: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {visibleCount < filteredItems.length && (
        <Box ref={loaderRef} sx={{ textAlign: "center", p: 2 }}>
          <CircularProgress />
        </Box>
      )}
      {status === "failed" && (
        <Typography color="error">Error loading contents.</Typography>
      )}
    </Box>
  );
}
