// import { List, Image } from "@antmjs/vantui";
import { View, Block, Text, Video, Audio, RichText, Image } from "@tarojs/components";

import Taro from "@tarojs/taro";
import { useEffect, useState } from 'react'
import useStateRef from 'react-usestateref';

import './node.scss'


function Node({
  name,
  attrs = {},
  childs = [],
  opts = [],
  imgs = [],
  onPlay,
  onLinktap,
  onError,
  tagStyle
}) {
  const [ctrl, setCtrl, ctrlRef] = useStateRef({});
  const [cusStyle, setCusStyle] = useState({})
  if(name === 'img'){
    setCusStyle(tagStyle)
  }
  function imgLoad(e, item, i) {
    // #ifndef H5 || APP-PLUS
    // 设置原宽度
    if (!childs[i].w)
      setCtrl(state => {
        state[i] = e.detail.width
        return state
      })
    else
      // #endif
      // 加载完毕，取消加载中占位图
      if ((opts[1] && !ctrlRef.current[i]) || ctrlRef.current[i] == -1)
        setCtrl(state => {
          state[i] = 1
          return state
        })
  }
  function mediaError(e, item) {
    onError &&
      onError({
        source: item.name,
        attrs: item.attrs,
        errMsg: e.type,
      });
  }
  function imgTap(item) {
    const images = imgs.map((t) => t.attrs?.src);
    const index = images.findIndex((t) => t === item.attrs.src);
    Taro.previewImage({
      current: item.attrs.src, // 当前显示图片的http链接
      urls: images,
    });
  }
  function linkTap(e) {
    const attrs = e.attrs || e;
    const href = attrs.href;
    onLinktap &&
      onLinktap(
        Object.assign(
          {
            // innerText: vm.root.getText(node.children || []), // 链接内的文本内容
            innerText: "",
          },
          attrs
        )
      );
    if (href) {
      if (href[0] === "#") {
        // 跳转锚点
        window.location.href = href.substring(1);
      } else if (href.split("?")[0].includes("://")) {
        // 复制外部链接
        window.open(href);
      } else {
        // 跳转页面
        // router.push(href);
        Taro.navigateTo({ url: href });
      }
    }
  }
  function play() {
    onPlay && onPlay();
  }

  // render
  // 行内标签列表
  var inlineTags = {
    abbr: true,
    b: true,
    big: true,
    code: true,
    del: true,
    em: true,
    i: true,
    ins: true,
    label: true,
    q: true,
    small: true,
    span: true,
    strong: true,
    sub: true,
    sup: true
  }
  function handleUse(item) {
    // 微信和 QQ 的 rich-text inline 布局无效
    if (inlineTags[item.name] || (item.attrs.style || '').indexOf('display:inline') != -1)
      return false
    return !item.c
  }

  // for 循环的block渲染
  function forBlockRender(n, i) {
    return (
      // <Block key={i}>
      //   {
      //     n.name === "img" ? renderImage(n)
      //       : (n.text ? renderText(n)
      //         : (n.name === "br" ? <View style={{ padding: '10px' }}><br /></View>
      //           : (n.name === "a" ? renderA(n, i)
      //             : (n.name === "video" ? renderVideo(n, i)
      //               : (n.name === "audio" ? renderAudio(n, i)
      //                 : n.name === "table" && n.c ? renderTable(n, i)
      //                   : n.c === 2 ? renderC2Action(n, i)
      //                     : lastRenderNode(n, i)
      //               )
      //             )
      //           )
      //         )
      //       )
      //   }
      // </Block>
      <Block key={i}>
        {
          n.name === "img" ? renderImage(n, i)
            : (n.text ? renderText(n)
              : (n.name === "br" ? <View style={{ padding: '10px' }}><br /></View>
                : (n.name === "a" ? renderA(n, i)
                  : (n.name === "video" ? renderVideo(n, i)
                    : (n.name === "audio" ? renderAudio(n, i)
                      : n.name === "table" && n.c ? renderTable(n, i)
                        : n.c === 2 ? renderC2Action(n, i)
                          : handleUse(n) ? <RichText id={n.attrs.id} style={n.f+';max-width: 100%'} nodes={[n]}></RichText>
                            : !n.c ? <RichText id={n.attrs.id} style={n.f + ';display:inline;max-width: 100%'} preview={false} nodes={[n]}></RichText>
                              : n.c == 2 ? <View id={n.attrs.id} class={'_' + n.name + n.attrs.class} style={n.f + ';' + n.attrs.style}>
                                {
                                  n.children.map((n2, j) => (
                                    <Node tagStyle={tagStyle} key={j} style={n2.f} name={n2.name} attrs={n2.attrs} childs={n2.children} opts={opts} />
                                  ))
                                }
                              </View>
                                : lastRenderNode(n, i)
                    )
                  )
                )
              )
            )
        }
      </Block>
    )
  }
  function renderImage(n, i) {
    // if ((opts[1] && !ctrl[i]) || ctrl[i] < 0) {
    //   // 占位图
    //   return <Image className='_img' style={n.attrs.style} src={ctrl[i] < 0 ? opts[2] : opts[1]} mode='widthFix' />
    // }
    // if (Taro.getEnv() === Taro.ENV_TYPE.WEB || Taro.getEnv() === Taro.ENV_TYPE.RN || Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
    //   return <Image
    //     id={n.attrs.id}
    //     className={'_img ' + n.attrs.class}
    //     style={(ctrl[i] == -1 ? 'display:none;' : '') +
    //       'width:' + (ctrl[i] || 1) + 'px;height:1px;' +
    //       n.attrs.style} src={n.attrs.src}
    //     mode={n.h ? '' : 'widthFix'}
    //     lazy-load={opts[0]} webp={n.webp}
    //     show-menu-by-longpress={opts[3] && !n.attrs.ignore}
    //     image-menu-prevent={!opts[3] || n.attrs.ignore}
    //     onLoad={(e) => imgLoad(e, n, i)}
    //     onError={(e) => mediaError(e, n)}
    //     onClick={() => imgTap(n)}
    //   />
    // }
    return <Image
      id={n.attrs.id}
      className={"_img " + n.attrs.class}
      style={(ctrl[i] === -1 ? "display:none;" : "") + n.attrs.style}
      src={n.attrs.src || (ctrl.load ? n.attrs["data-src"] : "")}
      data-i={i}
      mode={n.h ? '' : 'widthFix'}
      onLoad={(e) => imgLoad(e, n, i)}
      onError={(e) => mediaError(e, n)}
      onClick={() => imgTap(n)}
    />
  }
  function renderText(n) {
    return <Text user-select={n.us} decode>
      {n.text}
    </Text>
  }
  function renderVideo(n, i) {
    return <Video
      id={n.attrs.id}
      className={n.attrs.class}
      style={n.attrs.style}
      autoplay={n.attrs.autoplay}
      controls={n.attrs.controls}
      loop={n.attrs.loop}
      muted={n.attrs.muted}
      object-fit={n.attrs["object-fit"]}
      poster={n.attrs.poster}
      src={n.src[ctrl[i] || 0]}
      data-i={i}
      onPlay={play}
      onError={(e) => mediaError(e, n)}
    />
  }
  function renderA(n, i) {
    return <Text
      id={n.attrs.id}
      className={(n.attrs.href ? "_a " : "") + n.attrs.class}
      hover-class='_hover'
      style={"display:inline;" + n.attrs.style}
      data-i={i}
      onClick={() => linkTap(n)}
    >
      <Node
        name='span'
        tagStyle={tagStyle}
        childs={n.children}
        opts={opts}
        style='display: inherit'
        imgs={imgs}
      />
    </Text>
  }
  function renderAudio(n, i) {
    return <Audio
      id={n.attrs.id}
      className={n.attrs.class}
      style={n.attrs.style}
      author={n.attrs.author}
      controls={n.attrs.controls}
      loop={n.attrs.loop}
      name={n.attrs.name}
      poster={n.attrs.poster}
      src={n.src[ctrl[i] || 0]}
      data-i={i}
      onPlay={play}
      oneError={(e) => mediaError(e, n)}
    />
  }
  function renderTable(n) {
    return <Block>
      {n.name === "li" ? (
        <Node tagStyle={tagStyle} childs={n.children} opts={opts} imgs={imgs} />
      ) : (
        <View
          className={"_" + tbody.name + " " + tbody.attrs.class}
          style={tbody.attrs.style}
        >
          {n.children.map((tbody, x) => (
            <>
              {tbody.name === "td" || tbody.name === "th" ? (
                <Node tagStyle={tagStyle} childs={tbody.children} opts={opts} imgs={imgs}></Node>
              ) : (
                <>
                  {tbody.children.map((tr, y) => (
                    <>
                      {tr.name === "td" || tr.name === "th" ? (
                        <View
                          className={
                            "_" + tr.name + " " + tr.attrs.class
                          }
                          style={tr.attrs.style}
                        >
                          <Node tagStyle={tagStyle} childs={tr.children} opts={opts} imgs={imgs} />
                        </View>
                      ) : (
                        <View
                          className={
                            "_" + tr.name + " " + tr.attrs.class
                          }
                          style={tr.attrs.style}
                        >
                          {tr.children.map((td, z) => (
                            <View
                              className={
                                "_" + td.name + " " + td.attrs.class
                              }
                              style={td.attrs.style}
                            >
                              <Node
                                tagStyle={tagStyle}
                                childs={td.children}
                                opts={opts}
                                imgs={imgs}
                              />
                            </View>
                          ))}
                        </View>
                      )}
                    </>
                  ))}
                </>
              )}
            </>
          ))}
        </View>
      )}
    </Block>
  }
  function renderC2Action(n) {
    return <View
      id={n.attrs.id}
      className={"_block _" + n.name + " " + n.attrs.class}
      style={n.f + ";" + n.attrs.style}
    >
      {n.children.map((n2, j) => (
        <Node
          key={j}
          style={n2.f}
          name={n2.name}
          attrs={n2.attrs}
          childs={n2.children}
          opts={opts}
          imgs={imgs}
          tagStyle={tagStyle}
        />
      ))}
    </View>
  }
  function lastRenderNode(n) {
    return <Node
      style={n.f}
      name={n.name}
      attrs={n.attrs}
      childs={n.children}
      opts={opts}
      imgs={imgs}
      tagStyle={tagStyle}
    />
  }
  return (
    <View
      id={attrs.id}
      // node-component _block _ ${name} ${attrs.class}
      className={'_' + name + ' ' + attrs.class}
      style={`${attrs.style};`}
    >
      {childs.map((n, i) => (
        forBlockRender(n, i)
      ))}
    </View>
  );
}

export default Node;
