import { JSDOM } from "jsdom";
import * as marked from "marked";
import {
  TelegraphNodeType,
  TelegraphPageNodeElementInterface,
} from "../interfaces/telegraph.interface";

export const markdownToNodes = (markdown: string): TelegraphNodeType[] => {
  const html = marked.parse(markdown);
  const dom = new JSDOM(`<div>${html}</div>`);
  const document = dom.window.document;
  const node = domToNode(document.body.firstChild as Element);
  return node ? [node] : [];
};

function domToNode(domNode: Element | Text): TelegraphNodeType | false {
  if (domNode.nodeType === 3) {
    // Text node
    const textNode = domNode as Text;
    const text = textNode.data.trim();
    return text || false;
  }
  if (domNode.nodeType === 1) {
    // Element node
    const elementNode = domNode as Element;
    const nodeElement: TelegraphPageNodeElementInterface = {
      tag: elementNode.tagName.toLowerCase(),
      children: [],
    };
    if (elementNode.attributes) {
      Array.from(elementNode.attributes).forEach((attr) => {
        if (attr.name === "href" || attr.name === "src") {
          nodeElement.attrs = nodeElement.attrs || {};
          nodeElement.attrs[attr.name] = attr.value;
        }
      });
    }
    domNode.childNodes.forEach((child) => {
      const childNode = domToNode(child as Element | Text);
      if (childNode) {
        nodeElement.children.push(childNode);
      }
    });
    return nodeElement;
  }
  return false;
}
