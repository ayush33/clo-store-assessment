import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";

export default function ContentCard({ item }) {
  return (
    <Card sx={{ width: "100%", borderRadius: 2, boxShadow: 2 }}>
      <CardMedia
        component="img"
        height="200"
        image={item.imagePath}
        alt={item.title}
        width="100%"
      />
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary">
          {item.creator}
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body1" fontWeight="bold">
            {item.title}
          </Typography>

          <Typography variant="body2" color="primary">
            {item.pricingOption === 0
              ? item.price
              : item.pricingOption === 1
                ? "Free"
                : "View Only"}
          </Typography>
        </Box>
      </CardContent>

    </Card>

  );
}
