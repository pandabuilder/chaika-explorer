import React, {useState} from 'react';

import SearchFilters from './SearchFilters';
import logo from "../logo57.png";
import {mainSite} from "../config";

type HeaderProps = {
    tags: string[],
    setTags: (value: (((prevState: string[]) => string[]) | string[])) => void,
}

const Header = ({ tags, setTags }: HeaderProps) => {
    const [visible, setVisible] = useState<boolean>(true);
    const toggleVisible = () => {
        setVisible(!visible);
    };
    return (
    <nav className={`navbar ${visible ? 'active' : ''}`}>

        <div className="title">
            <a className="navbar-brand" href={mainSite}>
                <img alt="PG" src={logo} width="28" height="28"/>
            </a>
            <span>Chaika Explorer</span>
        </div>
        <div className="btn toggle-btn" onClick={toggleVisible}>Toggle Filters</div>
        <SearchFilters tags={tags} setTags={setTags} visible={visible} />
    </nav>)
};

export default Header;