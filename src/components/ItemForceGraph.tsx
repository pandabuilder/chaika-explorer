import ForceGraph2D, {LinkObject, NodeObject} from 'react-force-graph-2d';
import React, {useState} from "react";

import {ArchiveOrGalleryInfo, indexConfigInfo} from "../types";


type ForceGraphProps = {
  data: ArchiveOrGalleryInfo[],
  indexConfig: indexConfigInfo
}

// type ItemNode = {
//   id: string,
//   model: string,
//   url?: string,
//   title?: string,
//   label: string
// }


interface ItemNode extends NodeObject {
  links?: LinkObject[];
  __bckgDimensions?: number[];
  color?: string | CanvasGradient | CanvasPattern;
  model?: string,
  url?: string,
  title?: string,
  label?: string,
  thumbnail?: string
  name?: string
  scope?: string
}

const formatData = (data: ArchiveOrGalleryInfo[], indexConfig: indexConfigInfo) => {

  const nodes: ItemNode[] = [];
  const links: { source: string; target: string; }[] = [];
  // const uploaders = new Map<string, {id: string, model: string}>();
  const categories = new Map<string, {id: string, model: string, label: string}>();
  const tags = new Map<string, ItemNode>();

  data.forEach((a) => {

    const linkObjects: LinkObject[] = []

    const NewObject = {
      id: a._id,
      url: indexConfig.indexIsGallery ? `${indexConfig.mainSite}/gallery/${a._id}` : `${indexConfig.mainSite}/archive/${a._id}`,
      model: indexConfig.indexIsGallery ? "Gallery" : "Archive",
      title: a.title,
      label: a.title,
      thumbnail: a.thumbnail, links: linkObjects

    }

    nodes.push(NewObject);

    // if (a.uploader) {
    //   if(!uploaders.has(a.uploader)) {
    //     uploaders.set(a.uploader, {
    //       id: a.uploader,
    //       model: "Uploader"
    //     })
    //   }
    //   links.push({
    //     source: a.uploader,
    //     target: a._id
    //   });
    // }

    if (a.category) {
      if (!categories.has(a.category)) {
        categories.set(a.category, {
          id: a.category,
          model: "Category",
          label: a.category
        })
      }
      links.push({
        source: a.category,
        target: a._id
      });
    }

    a.tags.forEach((t) => {

      const NewTag = {
        source: a._id,
        target: t.full
      }

      if (!tags.has(t.full)) {

        const linkObjectsTag: LinkObject[] = []

        const NewTagObject = {
          id: t.full,
          model: "Tag",
          label: t.full,
          name: t.name,
          scope: t.scope,
          links: linkObjectsTag
        }

        tags.set(t.full, NewTagObject);

        NewTagObject.links.push(NewTag);

      }
      else {
        tags.get(t.full)?.links?.push(NewTag);
      }

      NewObject.links.push(NewTag);

      links.push(NewTag);
    });

  });

  // uploaders.forEach((x) => {
  //   nodes.push(x);
  // })

  categories.forEach((x) => {
    nodes.push(x);
  })

  tags.forEach((x) => {
    nodes.push(x);
  })

  return {
    nodes: nodes,
    links
  };
};

const ItemForceGraph = ({ data, indexConfig }: ForceGraphProps) => {

  const [highlightLinks, setHighlightLinks] = useState(new Set<LinkObject>());
  // const [hoverNode, setHoverNode] = useState<ItemNode | null>(null);

  const updateHighlight = () => {
    setHighlightLinks(highlightLinks);
  };

  const handleNodeHover = (node: ItemNode | null) => {
    highlightLinks.clear();
    if (node && node.links) {

      node.links.forEach(link => highlightLinks.add(link));
    }

    // setHoverNode(node || null);
    updateHighlight();
  };

  const handleLinkHover = (link: LinkObject | null) => {
    highlightLinks.clear();

    if (link) {
      highlightLinks.add(link);
    }

    updateHighlight();
  };

  return (
    <ForceGraph2D
      width={1500}
      height={650}
      graphData={formatData(data, indexConfig)}
      onNodeHover={handleNodeHover}
      onLinkHover={handleLinkHover}
      nodeLabel={(node: ItemNode) => {
        if((node.model === "Archive" || node.model === "Gallery") && node.title) {
          return node.title;
        }
        else if(node.model === "Archive" && node.title) {
          return node.title;
        }
        return node.id ? `${node.id}` : 'none';
      }}
      nodeAutoColorBy={'model'}
      nodeRelSize={8}
      nodeCanvasObjectMode={(node: ItemNode) => {
        if (node.model === "Tag" || node.model === "Archive" || node.model === "Gallery") {
          return 'replace';
        }
        return 'after';
      }
      }
      linkWidth={link => highlightLinks.has(link) ? 4 : 2}
      linkDirectionalParticleWidth={link => highlightLinks.has(link) ? 4 : 0}
      linkColor={(link) => highlightLinks.has(link) ? `rgb(37, 187, 51)` : `rgba(44,141,0,0.55)`}
      nodeCanvasObject={
        (node: ItemNode, ctx) => {
          if (node.model === "Tag" && node.x && node.y) {
            const label = node.label || 'none';
            // if(node.scope && node.name) {
            //   label = `${node.scope}|${node.name}`
            // }
            const fontSize = 2;
            ctx.font = `${fontSize}px Segoe UI`;
            const textWidth = ctx.measureText(label).width;
            const bckgDimensions = [textWidth, fontSize].map(
              (n) => n + fontSize * 0.2
            );
            ctx.fillStyle = `rgba(0, 0, 0, 0.8)`;
            ctx.fillRect(
              node.x - bckgDimensions[0] / 2,
              node.y - bckgDimensions[1] / 2,
              bckgDimensions[0],
              bckgDimensions[1],
            );
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            if(node.color !== undefined) {
              ctx.fillStyle = node.color;
            }
            ctx.fillText(label, node.x, node.y);

            node.__bckgDimensions = bckgDimensions;
          } else if ((node.model === "Archive" || node.model === "Gallery") && node.thumbnail && node.x && node.y) {
            const size_x = 200 * 0.06;
            const size_y = 290 * 0.06;
            const img = new Image();
            img.src = node.thumbnail;
            ctx.drawImage(img, node.x - size_x / 2, node.y - size_y / 2, size_x, size_y);
          }

        }
      }
      onNodeClick={(node: ItemNode) => {
        if ((node.model === "Archive" || node.model === "Gallery")) {
          window.open(node.url, '_blank');
        }
      }}
    />
  )
};

export default ItemForceGraph;