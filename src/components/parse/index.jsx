import { useEffect, useState } from "react";
import useStateRef from 'react-usestateref';
import Parser from './parser'
import Node from './node'
import './index.scss'


function Index({
  containerStyle = "",
  content = "",
  copyLink = true,
  domain = "",
  errorImg = "",
  lazyLoad = false,
  loadingImg = "",
  pauseVideo = true,
  previewImg = true,
  scrollTable = false,
  selectable = false,
  setTitle = true,
  showImgMenu = true,
  tagStyle = {},
  useAnchor = false,
}) {
  const [nodes, setNodes] = useState([]);
  const [, setImgs, imgs] = useStateRef([]);

  useEffect(() => {
    if (content && !nodes.length) {
      setContent(content);
    }
  }, [content]);

  function findImgNode(nodesPar = []){
    nodesPar.map(t => {
      if(t.name === 'img'){
        // imgs.value.push(t)
        setImgs(state => ([...state, t]))
      }
      if(t.children && t.children.length){
        findImgNode(t.children)
      }
    })
  }

  // eslint-disable-next-line no-shadow
  function setContent(content, append) {
    let isNodes = new Parser({ tagStyle: tagStyle, nodes: [] }).parse(content)
    isNodes = isNodes || []
    findImgNode(isNodes)
    console.log(isNodes, 'isNodes')
    console.log(imgs.current, 'imgs.current')
    setNodes([...isNodes])
  }
  return <Node tagStyle={tagStyle} childs={nodes} imgs={imgs.current} opts={[lazyLoad, loadingImg, errorImg, showImgMenu]} name='span'></Node>;
}

export default Index;
