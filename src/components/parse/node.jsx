import { List , Image } from "@antmjs/vantui";
import { View, Block, Text, Video, Audio, RichText } from "@tarojs/components";

import Taro from "@tarojs/taro";
import { useEffect, useState } from 'react'
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
}) {
  const [ctrl] = useState({});

  function imgLoad() { }
  function mediaError(e, item) {
    onError &&
      onError({
        source: item.name,
        attrs: item.attrs,
        errMsg: e.type,
      });
  }
  function imgTap(item) {
    console.log(item, 'item')
    console.log(imgs, 'imgs')
    // const images = imgs.map((t) => t.attrs?.src);
    // const index = images.findIndex((t) => t === item.attrs.src);
    // Taro.previewImage({
    //   current: item.attrs.src, // 当前显示图片的http链接
    //   urls: images,
    // });
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


  // for 循环的block渲染
  function forBlockRender(n, i) {
    return (
      <Block key={i}>
        {
          n.name === "img" ? renderImage(n)
            : (n.text ? renderText(n)
              : (n.name === "br" ? <View style={{ padding: '10px' }}><br /></View>
                : (n.name === "a" ? renderA(n, i)
                  : (n.name === "video" ? renderVideo(n, i)
                    : (n.name === "audio" ? renderAudio(n, i)
                      : n.name === "table" && n.c ? renderTable(n, i)
                        : n.c === 2 ? renderC2Action(n, i) : lastRenderNode(n, i))
                  )
                )
              )
            )
        }
      </Block>
    )
  }
  function renderImage(n, i) {
    return <Image
      id={n.attrs.id}
      className={"_img " + n.attrs.class}
      style={(ctrl[i] === -1 ? "display:none;" : "") + n.attrs.style}
      src={n.attrs.src || (ctrl.load ? n.attrs["data-src"] : "")}
      data-i={i}
      fit={n.h?'':'widthFix'}
      onLoad={imgLoad}
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
        childs={n.children}
        opts={opts}
        style='display: inherit'
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
        <Node childs={n.children} opts={opts} />
      ) : (
        <View
          className={"_" + tbody.name + " " + tbody.attrs.class}
          style={tbody.attrs.style}
        >
          {n.children.map((tbody, x) => (
            <>
              {tbody.name === "td" || tbody.name === "th" ? (
                <Node childs={tbody.children} opts={opts}></Node>
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
                          <Node childs={tr.children} opts={opts} />
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
                                childs={td.children}
                                opts={opts}
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
    />
  }
  return (
    <View
      id={attrs.id}
      className={`node-component _block _ ${name} ${attrs.class}`}
      style={attrs.style}
    >
      {childs.map((n, i) => (
        forBlockRender(n, i)
      ))}
    </View>
  );
}

export default Node;