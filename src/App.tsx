import React, {useState} from 'react';
import moment from 'moment';
import {
  ReactiveBase,
  ReactiveList,
  ResultList,
  SelectedFilters,
  DataSearch
} from "@appbaseio/reactivesearch";
import {fileSizeIEC, getCurrentIndex, sortTagsObject} from './utils';

import './App.css';

import no_cover from "./assets/no_cover.png";
import {ArchiveOrGalleryInfo, indexConfigInfo} from "./types";
import {TagButton} from "./components/Tag";
import theme from "./theme";
import Header from "./components/Header";
import ItemForceGraph from "./components/ItemForceGraph";
import {Histogram} from "./components/Histogram";

const { ResultListWrapper } = ReactiveList;

// TODO: DataSearch dataField is not working correctly, either disable tags.full or write a custom query since it's
// not interacting correctly with .keyword string

function App() {

  const [tags, setTags] = useState<string[]>([]);
  const [indexConfig, setIndexConfig] = useState<indexConfigInfo>(getCurrentIndex());
  const [showForceGraph, setForceGraph] = useState<boolean>(false);
  const [showHistogram, setHistogram] = useState<boolean>(false);
  const [histogramType, setHistogramType] = useState<string>('year');

  const addTagToState = (tagFull: string) => {
    if(tags == null) {
      setTags([tagFull])
    }
    else if(!tags.includes(tagFull)) {
      setTags([...tags, tagFull])
    }
  };

  const getSortOptions = (galleryMode: boolean) =>
    galleryMode ? [
      {
        label: 'Best Match',
        dataField: '_score',
        sortBy: 'desc',
      },
      {
        label: 'Posted Date (desc)',
        dataField: 'posted_date',
        sortBy: 'desc',
      },
      {
        label: 'Posted Date (asc)',
        dataField: 'posted_date',
        sortBy: 'asc',
      },
      {
        label: 'Image Count (desc)',
        dataField: 'image_count',
        sortBy: 'desc',
      },
      {
        label: 'Image Count (asc)',
        dataField: 'image_count',
        sortBy: 'asc',
      },
      {
        label: 'File Size (desc)',
        dataField: 'size',
        sortBy: 'desc',
      },
      {
        label: 'File Size (asc)',
        dataField: 'size',
        sortBy: 'asc',
      },
    ] : [
      {
        label: 'Best Match',
        dataField: '_score',
        sortBy: 'desc',
      },
      {
        label: 'Posted Date (desc)',
        dataField: 'original_date',
        sortBy: 'desc',
      },
      {
        label: 'Posted Date (asc)',
        dataField: 'original_date',
        sortBy: 'asc',
      },
      {
        label: 'Published Date (desc)',
        dataField: 'public_date',
        sortBy: 'desc',
      },
      {
        label: 'Published Date (asc)',
        dataField: 'public_date',
        sortBy: 'asc',
      },
      {
        label: 'Image Count (desc)',
        dataField: 'image_count',
        sortBy: 'desc',
      },
      {
        label: 'Image Count (asc)',
        dataField: 'image_count',
        sortBy: 'asc',
      },
      {
        label: 'File Size (desc)',
        dataField: 'size',
        sortBy: 'desc',
      },
      {
        label: 'File Size (asc)',
        dataField: 'size',
        sortBy: 'asc',
      },
    ];

  const getResultListWrapper = (data: ArchiveOrGalleryInfo[]) => {
    return <ResultListWrapper>
      {
        data.map((item: ArchiveOrGalleryInfo) => (
          <ResultList key={item._id}>
            <a className="navbar-brand"
              href={indexConfig.indexIsGallery ? `${indexConfig.mainSite}/gallery/${item._id}` : `${indexConfig.mainSite}/archive/${item._id}`}>
              <ResultList.Image
                src={item.thumbnail ? item.thumbnail : no_cover}
                className="result-image"
              />
            </a>
            <ResultList.Content>
              <ResultList.Title>
                <div className={"result-title"}>{item.title}</div>
              </ResultList.Title>
              {
                item.title_jpn ? <div className={"result-title"}>
                  {item.title_jpn}
                </div> : ''
              }
              <ResultList.Description>
                <div className={'result-row'}>
                  <div className={'result-tags'}>
                    {
                      sortTagsObject(item.tags).map(
                        tagGroup => <div className={'flex wrap'} key={tagGroup[0].scope}>
                          {tagGroup[0].scope ?
                            <span className={"info-label"}>{tagGroup[0].scope + ': '}</span> : ''}
                          {
                            tagGroup.map(
                              tag =>
                                <TagButton
                                  key={tag.full}
                                  onClick={addTagToState}
                                  tag={tag}
                                  active={tags ? tags.includes(tag.full) : false}
                                />
                            )
                          } </div>
                      )
                    }
                  </div>
                  <div className={'result-column'}>
                    <div>
                      {
                        indexConfig.indexIsGallery ?
                          <div><span
                            className={"info-label"}>Posted:</span>{item.posted_date ? moment(item.posted_date).format('MM-DD-YYYY') : ''}
                          </div> :
                          <div><span
                            className={"info-label"}>Posted:</span>{item.original_date ? moment(item.original_date).format('MM-DD-YYYY') : ''}
                          </div>
                      }
                      <div><span
                        className={"info-label"}>Source:</span>{indexConfig.indexIsGallery ? item.provider : item.source_type}
                      </div>
                      <div><span className={"info-label"}>Reason:</span>{item.reason}</div>
                      <div><span className={"info-label"}>Category:</span>{item.category}</div>
                      <div><span className={"info-label"}>Images:</span>{item.image_count}</div>
                      <div><span className={"info-label"}>Size:</span>{fileSizeIEC(item.size)}</div>
                      {
                        indexConfig.indexIsGallery ?
                          '' :
                          <div><span
                            className={"info-label"}>Published:</span>{item.public_date ? moment(item.public_date).format('MM-DD-YYYY') : ''}
                          </div>
                      }
                    </div>
                  </div>
                </div>
              </ResultList.Description>
            </ResultList.Content>
          </ResultList>
        ))
      }
    </ResultListWrapper>;
  }

  return (
    <ReactiveBase
      app={indexConfig.indexName}
      url={indexConfig.apiUrl}
      theme={theme}
      themePreset={"dark"}
    >
      <div className="flex row-reverse app-container">
        <Header
          tags={tags} setTags={setTags} indexConfig={indexConfig} setIndexConfig={setIndexConfig}
          showForceGraph={showForceGraph} setForceGraph={setForceGraph}
          showHistogram={showHistogram} setHistogram={setHistogram}
        />
        <div className="results-container">
          <DataSearch
            componentId="q"
            filterLabel="Term"
            placeholder="Search for Archive title, japanese title or tags"
            dataField={["title", "title_jpn", "tags.full.keyword"]}
            iconPosition="right"
            autosuggest={true}
            queryFormat="and"
            debounce={100}
            // queryString={true}
            className="data-search-container results-container"
            innerClass={{
              input: 'search-input',
              list: 'search-list',
            }}
            URLParams={true}
          />
          <div className="result-list">
            <SelectedFilters className="m1"/>
            {
              showHistogram ? <Histogram galleryMode={indexConfig.indexIsGallery} interval={histogramType} setHistogramType={setHistogramType}/> : ''
            }
            <ReactiveList
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
                  indexConfig.indexIsGallery ? '' : 'published'
                ]
              }}
              pagination={true}
              paginationAt="both"
              size={showForceGraph ? 100 : 15}
              componentId="page"
              dataField="title"
              showLoader={false}
              renderResultStats={
                function(stats: any){ // eslint-disable-line @typescript-eslint/no-explicit-any
                  return (
                    `Showing ${stats.displayedResults} of total ${stats.numberOfResults} in ${stats.time} ms`
                  )
                }
              }
              innerClass={{
                list: 'result-list-container',
                pagination: 'result-list-pagination',
                resultsInfo: 'result-list-info',
                poweredBy: 'powered-by',
              }}
              sortOptions={getSortOptions(indexConfig.indexIsGallery)}
              defaultSortOption={'Posted Date (desc)'}
              URLParams={true}
            >
              {({ data, error }) => (
                error ?
                  <div>Something went wrong! Wait a moment or report the error if it persists</div> :
                  !showForceGraph ?
                    getResultListWrapper(data) :
                    <ItemForceGraph data={data} indexConfig={indexConfig}/>
              )}
            </ReactiveList>
          </div>
        </div>
      </div>
    </ReactiveBase>
  );
}

export default App;
