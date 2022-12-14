import React, {useState} from 'react';

import SearchFilters from './SearchFilters';
import logo from "../logo57.png";
import {indicesConfiguration, mainSite} from "../config";
import {updateSearchParam} from "../utils";
import './Header.css';
import {indexConfigInfo} from "../types";


type HeaderProps = {
    tags: string[],
    setTags: (value: (((prevState: string[]) => string[]) | string[])) => void,
    indexConfig: indexConfigInfo,
    setIndexConfig: (value: (((prevState: indexConfigInfo) => indexConfigInfo) | indexConfigInfo)) => void,
    showForceGraph: boolean,
    setForceGraph: (value: boolean) => void,
    showHistogram: boolean,
    setHistogram: (value: boolean) => void,
}

const Header = ({ tags, setTags, indexConfig, setIndexConfig, showForceGraph, setForceGraph, showHistogram, setHistogram }: HeaderProps) => {
    const [visible, setVisible] = useState<boolean>(true);
    const toggleVisible = () => {
        setVisible(!visible);
    };
    const setIndexConfigByName = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const index = event.target.value;
        const indexParams = indicesConfiguration.find(x => x.name === index);
        const currentIndexParams = indexParams ? indexParams : indicesConfiguration[0];
        setIndexConfig(currentIndexParams);
        updateSearchParam('index', currentIndexParams.name);
    };
    const toggleForceGraph = () => {
        setForceGraph(!showForceGraph);
    };
    const toggleHistogram = () => {
        setHistogram(!showHistogram);
    };
    return (
    <nav className={`navbar ${visible ? 'active' : ''}`}>
        <div className="title">
            <a className="navbar-brand" href={mainSite}>
                <img alt="PG" src={logo} width="28" height="28"/>
            </a>
            <span>Chaika Explorer</span>
        </div>
        <div className={"flex-container"}>
            <select className={`btn mode-btn col-small `} value={indexConfig.name} onChange={setIndexConfigByName}>
                {
                    indicesConfiguration.map(
                      x => <option value={x.name}>{x.name}</option>
                    )
                }
            </select>
            <div className={`btn mode-btn col-small ${showForceGraph ? 'header-active': ''}`} onClick={toggleForceGraph}>{'ForceGraph'}</div>
            <div className={`btn mode-btn col-small ${showHistogram ? 'header-active': ''}`} onClick={toggleHistogram}>{'Histogram'}</div>
        </div>
        <div className="btn toggle-btn" onClick={toggleVisible}>Toggle Filters</div>
        <SearchFilters tags={tags} setTags={setTags} visible={visible} galleryMode={indexConfig.indexIsGallery} />
    </nav>)
};

export default Header;