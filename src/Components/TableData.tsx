import { Button, Col, Form, FormControl, Row, Table } from "react-bootstrap";
import * as React from "react";
import data from "../MOCK_DATA.json";
import moment from "moment";
import Chart from "chart.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartPie, faTable } from "@fortawesome/free-solid-svg-icons";

const TableData = () => {
  const [queryString, setQuery] = React.useState("");
  const [queryIndustry, setIndustry] = React.useState("");
  const [queryDOB, setQueryDOB] = React.useState("");
  const [showChart, setShowChart] = React.useState(false);

  const [myChart, setChart] = React.useState<Chart>();

  React.useEffect(() => {
    if (showChart) {
      const getOccurrence = (array: typeof data, value: number) => {
        return array.filter((v) => moment(v.date_of_birth).month() === value)
          .length;
      };

      const ctx = document.getElementById("myChart") as HTMLCanvasElement;
      const options: Chart.ChartOptions = {
        scales: {
          xAxes: [
            {
              gridLines: {
                offsetGridLines: true,
              },
            },
          ],
        },
      };

      const d: Chart.ChartData = {
        labels: moment.months(),
        datasets: [
          {
            label: "# dates of births",
            data: data.map((y) =>
              getOccurrence(data, moment(y.date_of_birth).month())
            ),
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
            ],
            borderWidth: 2,
          },
        ],
      };

      const mc = new Chart(ctx, {
        type: "bar",
        data: d,
        options: options,
      });

      setChart(mc);
    } else {
      myChart?.destroy();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showChart]);

  let mock = [...data];

  if (queryIndustry) {
    mock = mock.filter((y) => y.industry === queryIndustry);
  }

  if (queryDOB) {
    mock = mock.filter((y) => y.date_of_birth === queryDOB);
  }

  if (queryString) {
    mock = mock.filter(
      (y) =>
        y.first_name?.toLowerCase()?.indexOf(queryString) !== -1 ||
        y.last_name?.toLowerCase()?.indexOf(queryString) !== -1
    );
  }

  const _filteringName = (
    e: React.ChangeEvent<EventTarget & HTMLInputElement>
  ) => {
    const q = e.currentTarget.value as string;
    if (q && q.trim()) {
      setQuery(q);
    } else {
      setQuery("");
    }
  };

  const _filteringDate = (
    e: React.ChangeEvent<EventTarget & HTMLInputElement>
  ) => {
    const value = e.currentTarget.value as string;
    const date = moment.utc(value, "DD/MM/YYYY", true);
    if (date.isValid() && value.trim()) {
      setQueryDOB(value);
    } else {
      setQueryDOB("");
    }
  };

  const _filterIndustry = (
    e: React.ChangeEvent<EventTarget & HTMLInputElement>
  ) => {
    const value = e.currentTarget.value;

    if (value) {
      setIndustry(value);
    } else {
      setIndustry("");
    }
  };

  const industries = [...new Set(data.map((y) => y.industry))] as string[];

  return (
    <Form>
      <Row style={{ marginTop: 15, marginBottom: 15 }}>
        <Col sm={3}>
          <FormControl placeholder="Search name..." onChange={_filteringName} />
        </Col>

        <Col sm={3}>
          <FormControl as="select" onChange={_filterIndustry}>
            <option value="">{"Choose Industry..."}</option>
            {industries
              .filter((y) => y != null && y !== "n/a")
              .map((ind, i) => (
                <React.Fragment key={i}>
                  <option value={ind}>{ind}</option>
                </React.Fragment>
              ))}
          </FormControl>
        </Col>

        <Col sm={3}>
          <FormControl placeholder={"DD/MM/YYYY"} onChange={_filteringDate} />
        </Col>

        <Col sm={1}>
          <Button onClick={() => setShowChart(!showChart)}>
            <FontAwesomeIcon icon={!showChart ? faChartPie : faTable} />
          </Button>
        </Col>
      </Row>

      <Row>
        {showChart ? (
          <div style={{ width: 900, height: 800, margin: 25 }}>
            <canvas id="myChart"></canvas>
          </div>
        ) : (
          <Table responsive="sm" striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>{"First Name"}</th>
                <th>{"Last Name"}</th>
                <th>{"Email"}</th>
                <th>{"Date of Birth"}</th>
                <th>{"Industry"}</th>
                <th>{"Salary"}</th>
                <th>{"Years of Experience"}</th>
              </tr>
            </thead>
            <tbody>
              {mock?.map((y, i) => (
                <React.Fragment key={i}>
                  <tr>
                    <td>{y.first_name}</td>
                    <td>{y.last_name}</td>
                    <td>{y.email}</td>
                    <td>{y.date_of_birth}</td>
                    <td>{y.industry}</td>
                    <td>{y.salary}</td>
                    <td>{y.years_of_experience}</td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        )}
      </Row>
    </Form>
  );
};

export default TableData;
