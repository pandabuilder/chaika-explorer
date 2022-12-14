import React from 'react';
import {ReactiveChart} from "@appbaseio/reactivesearch";
import {customQuery} from "./customQuery";
import './Histogram.css';

type OptionsProps = {
  title: string,
  xAxisName: string,
  yAxisName: string,
  aggregationData: any,
  value: string,
  labelFormatter: (...args: any[]) => any,
}

// setOption is mandatory on .ts, forcing setting up the chart again...
const GetHistogramChartOptions = ({
	title,
	xAxisName,
	yAxisName,
	aggregationData,
	value,
	labelFormatter,
}: OptionsProps) => {
	let chartTitle;
	if (title) {
		chartTitle = {
			text: title,
			textStyle: {
				color: "white",
			},
		};
	}
	const xAxisData = aggregationData.map((item: any) => ({
		value: item.key_as_string,
	}));
	let startIndex = -1;
	let endIndex = -1;
	if (value && Array.isArray(value)) {
		startIndex = xAxisData.findIndex((i: any) => i.value === value[0]);
		endIndex = xAxisData.findIndex((i: any) => i.value === value[1]);
	}
	return {
		title: chartTitle,
		toolbox: {
			feature: {
				dataZoom: {
					yAxisIndex: false,
					labelFormatter,
				},
				saveAsImage: {
					pixelRatio: 2,
				},
			},
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
			},
		},
		grid: {
			bottom: 90,
		},
		dataZoom: [
			{
				type: 'inside',
				startValue: startIndex > -1 ? startIndex : undefined,
				endValue: endIndex > -1 ? endIndex : undefined,
			},
			{
				type: 'slider',
				startValue: startIndex > -1 ? startIndex : undefined,
				endValue: endIndex > -1 ? endIndex : undefined,
			},
		],
		xAxis: {
			data: xAxisData,
			name: xAxisName,
			silent: false,
			splitLine: {
				show: false,
			},
			splitArea: {
				show: false,
			},
			axisLine: {
				lineStyle: {
					color: "#fff"
				}
			}
		},
		yAxis: {
			splitArea: {
				show: false,
			},
			name: yAxisName,
			axisLine: {
				lineStyle: {
					color: "#fff"
				}
			}
		},
		series: [
			{
				type: 'bar',
				data: aggregationData.map((item: any) => ({
					value: item.doc_count,
					name: item.key_as_string
				})),
				// Set 'large' for large data amount
				large: true,
			},
		],
		color: [
			'#5470c6',
			'#91cc75',
			'#fac858',
			'#ee6666',
			'#73c0de',
			'#3ba272',
			'#fc8452',
			'#9a60b4',
			'#ea7ccc'
		],
	};
};

type HistogramProps = {
	galleryMode: boolean,
	interval: string,
	setHistogramType: (value: string) => void,
}

export const Histogram = ({galleryMode, interval, setHistogramType} : HistogramProps) => (
  <div className={"histogram-chart"}>
		<div className="interval-selector">
			<div onChange={(event: React.ChangeEvent<HTMLInputElement>) => setHistogramType(event.target.value)}>
				<input type="radio" value="year" name="interval" checked={interval === 'year'}/> Yearly
				<input type="radio" value="month" name="interval" checked={interval === 'month'}/> Monthly
				<input type="radio" value="day" name="interval" checked={interval === 'day'}/> Daily
			</div>
		</div>
    <ReactiveChart
      componentId="histogramDate"
      dataField={galleryMode ? "posted_date" : "public_date"}
      type="range"
      chartType="histogram"
      filterLabel={galleryMode ? "Posted date" : "Published date"}
      title={galleryMode ? "Posted date" : "Published date"}
      URLParams
      defaultQuery={() => customQuery(galleryMode ? "posted_date" : "public_date", interval)}
      labelFormatter={(value) => `${value}`}
      loader={'Loading...'}
      useAsFilter={false} xAxisName={interval} yAxisName={'count'} xAxisField={''} yAxisField={''}
      onError={() => {}}
      renderError={(error: string) => <div>Something went wrong! {error}</div>}
      onChange={function () {}}
     	setOption={GetHistogramChartOptions}
			react={{
				and: [
					"tags",
					"reason",
					"source",
					"category",
					"q",
					"size",
					"count",
					'posted',
					galleryMode ? '' : 'published'
				]
			}}
		/>
  </div>
);
