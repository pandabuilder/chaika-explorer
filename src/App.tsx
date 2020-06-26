import React, {useState} from 'react';
import moment from 'moment';
import {
    ReactiveBase,
    ReactiveList,
    ResultList,
    SelectedFilters,
    DataSearch
} from "@appbaseio/reactivesearch";
import {fileSizeIEC, sortTagsObject} from './utils';

import './App.css';

import no_cover from "./no_cover.png";
import {apiUrl, mainSite} from "./config";
import {ArchiveInfo} from "./types";
import {TagButton} from "./components/Tag";
import theme from "./theme";
import Header from "./components/Header";

const { ResultListWrapper } = ReactiveList;

function App() {

    const [tags, setTags] = useState<string[]>([]);

    const addTagToState = (tagFull: string) => {
        if(tags == null) {
            setTags([tagFull])
        }
        else if(!tags.includes(tagFull)) {
            setTags([...tags, tagFull])
        }
    };

  return (
      <ReactiveBase
          app="viewer"
          url={apiUrl}
          theme={theme}
          themePreset={"dark"}
      >
          <div className="flex row-reverse app-container">
              <Header tags={tags} setTags={setTags} />
              <div className="results-container">
                  <DataSearch
                      componentId="titleReactor"
                      filterLabel="Term"
                      placeholder="Search for Archive title, japanese title or tags"
                      dataField={["title", "title_jpn", "tags.full"]}
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
                  />
                  <div className="result-list">
                      <SelectedFilters className="m1"/>
                      <ReactiveList
                          react={{
                              and: [
                                  "tagsReactor",
                                  "reasonReactor",
                                  "sourceReactor",
                                  "categoryReactor",
                                  "titleReactor",
                                  "SizeSliderSensor",
                                  "CountSliderSensor",
                                  'PostedDateSensor',
                                  'PublicDateSensor'
                              ]
                          }}
                          pagination={true}
                          paginationAt="both"
                          size={15}
                          componentId="SearchResult"
                          dataField="title"
                          showLoader={false}
                          renderResultStats={
                              function(stats: any){
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
                          sortOptions={[
                              {
                                  label: 'Best Match',
                                  dataField: '_score',
                                  sortBy: 'desc',
                              },
                              {
                                  label: 'Title',
                                  dataField: 'title',
                                  sortBy: 'asc',
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
                                  dataField: 'original_date',
                                  sortBy: 'desc',
                              },
                              {
                                  label: 'Published Date (asc)',
                                  dataField: 'original_date',
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
                          ]}
                      >
                          {({ data, error }) => (

                              error ? <div>
                                    Something went wrong! Wait a moment or report the error if it persists
                                  </div> :
                                  <ResultListWrapper>
                                      {
                                          data.map((item: ArchiveInfo) => (
                                              <ResultList key={item._id}>
                                                  <a className="navbar-brand" href={`${mainSite}/archive/${item._id}`}>
                                                      <ResultList.Image
                                                          src={item.thumbnail ? item.thumbnail : no_cover }
                                                          className="result-image"
                                                      />
                                                  </a>
                                                  <ResultList.Content>
                                                      <ResultList.Title>
                                                          <div>{item.title}</div>
                                                      </ResultList.Title>
                                                      {
                                                          item.title_jpn ? <div className={"subtitle"}>
                                                          {item.title_jpn}
                                                           </div> : ''
                                                      }
                                                      <ResultList.Description>
                                                          <div className={'result-row'}>
                                                              <div className={'result-tags'}>
                                                                  {
                                                                      sortTagsObject(item.tags).map(
                                                                          tagGroup => <div className={'flex wrap'} key={tagGroup[0].scope}>
                                                                              {tagGroup[0].scope ? <span className={"info-label"}>{tagGroup[0].scope + ': '}</span> : ''}
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
                                                                      <div><span className={"info-label"}>Posted:</span>{item.original_date ? moment(item.original_date).format('MM-DD-YYYY'): ''}</div>
                                                                      <div><span className={"info-label"}>Source:</span>{item.source_type}</div>
                                                                      <div><span className={"info-label"}>Reason:</span>{item.reason}</div>
                                                                      <div><span className={"info-label"}>Category:</span>{item.category}</div>
                                                                      <div><span className={"info-label"}>Images:</span>{item.image_count}</div>
                                                                      <div><span className={"info-label"}>Size:</span>{fileSizeIEC(item.size)}</div>
                                                                      <div><span className={"info-label"}>Published:</span>{item.public_date ? moment(item.public_date).format('MM-DD-YYYY') : ''}</div>
                                                                  </div>
                                                              </div>
                                                          </div>
                                                      </ResultList.Description>
                                                  </ResultList.Content>

                                              </ResultList>
                                          ))
                                      }
                                  </ResultListWrapper>
                          )}
                      </ReactiveList>
                  </div>
              </div>
          </div>
      </ReactiveBase>
  );
}

export default App;
