import React from 'react';
import {
    RangeSlider, MultiList, MultiDropdownList, DateRange,
} from '@appbaseio/reactivesearch'

type SearchFilterProps = {
    tags: string[],
    setTags: (value: (((prevState: string[]) => string[]) | string[])) => void,
    visible: boolean
}

const SearchFilters = ({ tags, setTags, visible }: SearchFilterProps) => (
    <div className={`flex column filters-container ${!visible ? 'hidden' : ''}`}>
        <div className="child m10">
            <MultiDropdownList
                dataField="reason"
                title="Reason"
                componentId="reasonReactor"
                placeholder="Reason"
                showFilter={true}
                filterLabel="Reason"
                innerClass={{
                    label: 'range-label',
                }}

            />
        </div>
        <div className="child m10">
            <MultiDropdownList
                dataField="source_type"
                title="Source"
                componentId="sourceReactor"
                placeholder="Source"
                showFilter={true}
                filterLabel="Source"
            />
        </div>
        <div className="child m10">
            <MultiDropdownList
                dataField="category"
                title="Category"
                componentId="categoryReactor"
                placeholder="Category"
                showFilter={true}
                filterLabel="Category"
            />
        </div>
        <div className="child m10">
            <DateRange
                title="Posted Date"
                componentId="PostedDateSensor"
                dataField="original_date"
                filterLabel="Posted"
            />
        </div>
        <div className="child m10">
            <DateRange
                title="Published Date"
                componentId="PublicDateSensor"
                dataField="public_date"
                filterLabel="Published"
            />
        </div>
        <div className="child m10">
            <RangeSlider
                componentId="SizeSliderSensor"
                dataField="size"
                title="File Size"
                filterLabel="File Size"
                range={{
                    start: 1,
                    end: 3221225472
                }}
                rangeLabels={{
                    start: "1B",
                    end: "3GB"
                }}
                react={{
                    and: ["sourceReactor", "categoryReactor", "reasonReactor", 'PostedDateSensor', 'PublicDateSensor']
                }}
                innerClass={{
                    label: 'range-label',
                }}
            />
        </div>
        <div className="child m10">
            <RangeSlider
                componentId="CountSliderSensor"
                dataField="image_count"
                title="Image Count"
                filterLabel="Image Count"
                range={{
                    start: 1,
                    end: 1000
                }}
                rangeLabels={{
                    start: "1",
                    end: "1000"
                }}
                react={{
                    and: ["sourceReactor", "categoryReactor", "reasonReactor", 'PostedDateSensor', 'PublicDateSensor']
                }}
                innerClass={{
                    label: 'range-label',
                }}
            />
        </div>
        <div className="child m10">
            <MultiList
                dataField="tags.full"
                title="Tags"
                componentId="tagsReactor"
                placeholder="Tags"
                showFilter={true}
                showCheckbox={true}
                filterLabel="Tags"
                queryFormat="and"
                react={{
                    and: [
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
                value={tags}
                onChange={setTags}
            />
        </div>
    </div>
);

export default SearchFilters;