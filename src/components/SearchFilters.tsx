import React from 'react';
import {
  MultiList, MultiDropdownList, DateRange, DynamicRangeSlider,
} from '@appbaseio/reactivesearch'
import {fileSizeIEC} from "../utils";

type SearchFilterProps = {
  tags: string[],
  setTags: (value: (((prevState: string[]) => string[]) | string[])) => void,
  visible: boolean,
  galleryMode: boolean
}

const SearchFilters = ({ tags, setTags, visible, galleryMode }: SearchFilterProps) => (
  <div className={`flex column filters-container ${!visible ? 'hidden' : ''}`}>
    <div className="child m10">
      <MultiDropdownList
        dataField="reason"
        title="Reason"
        componentId="reason"
        placeholder="Reason"
        showFilter={true}
        filterLabel="Reason"
        innerClass={{
          label: 'range-label',
        }}
        URLParams={true}

      />
    </div>
    <div className="child m10">
      <MultiDropdownList
        dataField={galleryMode ? "provider" : "source_type"}
        title="Source"
        componentId="source"
        placeholder="Source"
        showFilter={true}
        filterLabel="Source"
        URLParams={true}
      />
    </div>
    <div className="child m10">
      <MultiDropdownList
        dataField="category"
        title="Category"
        componentId="category"
        placeholder="Category"
        showFilter={true}
        filterLabel="Category"
        URLParams={true}
      />
    </div>
    <div className="child m10">
      <DateRange
        title="Posted Date"
        componentId="posted"
        dataField={galleryMode ? "posted_date" : "original_date"}
        filterLabel="Posted"
        URLParams={true}
      />
    </div>
    {galleryMode ?
      '' : <div className="child m10">
        <DateRange
          title="Published Date"
          componentId="published"
          dataField="public_date"
          filterLabel="Published"
          URLParams={true}
        />
      </div>
    }
    <div className="child m10">
      <DynamicRangeSlider
        componentId="size"
        dataField="size"
        title="File Size"
        filterLabel="File Size"
        defaultValue={(min, max) => (
          {
            "start": Math.max(min, 1),
            "end": max
          }
        )}
        stepValue={10} // 10MB
        rangeLabels={(min, max) => (
          {
            "start": fileSizeIEC(min),
            "end": fileSizeIEC(max)
          }
        )}
        react={{
          and: ["source", "category", "reason", 'posted', galleryMode ? '' : 'published']
        }}
        innerClass={{
          label: 'range-label',
        }}
        URLParams={true}
      />
    </div>
    <div className="child m10">
      <DynamicRangeSlider
        componentId="count"
        dataField="image_count"
        title="Image Count"
        filterLabel="Image Count"
        defaultValue={(min, max) => (
          {
            "start": Math.max(min, 1),
            "end": max
          }
        )}
        rangeLabels={(min, max) => (
          {
            "start": min,
            "end": max
          }
        )}
        react={{
          and: ["source", "category", "reason", 'posted', galleryMode ? '' : 'published']
        }}
        innerClass={{
          label: 'range-label',
        }}
        URLParams={true}
      />
    </div>
    <div className="child m10">
      <MultiList
        dataField="tags.full"
        title="Tags"
        componentId="tags"
        placeholder="Tags"
        showFilter={true}
        showCheckbox={true}
        filterLabel="Tags"
        queryFormat="and"
        react={{
          and: [
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
        value={tags}
        onChange={setTags}
        URLParams={true}
      />
    </div>
  </div>
);

export default SearchFilters;