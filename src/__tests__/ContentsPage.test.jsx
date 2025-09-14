import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import store from "../store";
import ContentsPage from "./ContentsPage";

function renderWithProviders(ui) {
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
}

test("renders page title", () => {
  renderWithProviders(<ContentsPage />);
  expect(
    screen.getByText(/CLO-SET CONNECT Store/i)
  ).toBeInTheDocument();
});

test("updates search box value on typing", () => {
  renderWithProviders(<ContentsPage />);

  const searchBox = screen.getByPlaceholderText(/Search by user or title/i);

  fireEvent.change(searchBox, { target: { value: "React" } });

  expect(screen.getByDisplayValue("React")).toBeInTheDocument();
});

test("filters contents when search is applied", async () => {
  renderWithProviders(<ContentsPage />);
  const searchBox = screen.getByPlaceholderText(/Search by user or title/i);
  fireEvent.change(searchBox, { target: { value: "abc" } });

});
