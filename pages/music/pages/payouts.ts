import { placeholder } from "shared/list.ts";
import { Chart } from "shared/mod.ts";
import { asRef, Box, Content, createPage, createRoute, Entry, Grid, isMobile, Label, Spinner } from "webgen/mod.ts";
import { API, PayoutResponse, stupidErrorAlert } from "../../../spec/mod.ts";

const data = asRef<"loading" | PayoutResponse[]>("loading");

const source = data.map((data) => data === "loading" ? [] : data);

export const payoutsPage = createPage(
    {
        label: "Payouts",
        weight: 10,
        route: createRoute({
            path: "/c/music?list=payouts",
            events: {
                onLazyInit: async () => {
                    const list = await API.getPayoutsByPayment().then(stupidErrorAlert);
                    data.value = list;
                },
            },
        }),
    },
    Content(
        Box(data.map((data) => data === "loading" ? Spinner() : [])),
        Grid(
            source.map((items) =>
                items.length > 0
                    ? Grid(
                        Grid(
                            Chart({
                                type: "bar",
                                data: {
                                    labels: items.map((row) => row.period.split(" to ")[0].split("Period ")[1].split("-").slice(0, 2).join("-")).reverse(),
                                    datasets: [
                                        {
                                            // label: "Revenue by Month (GBP)",
                                            data: items.map((row) => row.moneythisperiod.replace("£ ", "")).reverse(),
                                        },
                                    ],
                                },
                                options: {
                                    plugins: {
                                        title: {
                                            display: true,
                                            text: "Revenue by Month (GBP)",
                                            color: "white",
                                        },
                                        legend: {
                                            display: false,
                                        },
                                    },
                                    responsive: true,
                                    scales: {
                                        x: {
                                            stacked: true,
                                        },
                                        y: {
                                            stacked: true,
                                        },
                                    },
                                },
                            }),
                            Chart({
                                type: "bar",
                                data: {
                                    labels: items.map((row) => row.period.split(" to ")[0].split("Period ")[1].split("-").slice(0, 2).join("-")).reverse(),
                                    datasets: [
                                        {
                                            label: "Streams by Month",
                                            data: items.map((row) => row.streams).reverse(),
                                        },
                                    ],
                                },
                                options: {
                                    plugins: {
                                        title: {
                                            display: true,
                                            text: "Streams by Month",
                                            color: "white",
                                        },
                                        legend: {
                                            display: false,
                                        },
                                    },
                                    responsive: true,
                                    scales: {
                                        x: {
                                            stacked: true,
                                        },
                                        y: {
                                            stacked: true,
                                        },
                                    },
                                },
                            }),
                        ).setEvenColumns(isMobile.map((x) => x ? 1 : 2)),
                        Box(items.map((item) =>
                            Entry(
                                Grid(
                                    Label(item.period).setTextSize("3xl").setFontWeight("bold"),
                                    Label(`${item.moneythisperiod} Earnings`),
                                    Label(`${item.streams} Streams`),
                                ).setPadding("1rem 0"),
                            )
                        )),
                    )
                    : placeholder("No Payouts", `You don't have any Payouts yet.`)
            ),
        ),
    ),
);
