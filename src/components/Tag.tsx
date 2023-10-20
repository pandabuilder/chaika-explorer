import React from 'react';
import {Tag} from "../types"; // we need this to make JSX compile

type TagProps = {
  tag: Tag,
  active: boolean,
  onClick: (text: string) => void
}

export const TagButton = ({ tag, active, onClick }: TagProps) => {

  const handleClick = () => {onClick(tag.full)};

  return <div className={`topic${active ? ' active' : ''}`} onClick={handleClick}>{tag.name}</div>;
};
