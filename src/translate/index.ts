import { query } from './query'
import { getWordArray, cleanWord } from './format'

import { Hover, Position, TextDocument, languages, window } from 'vscode';
const markdownHeader = `翻译 \`$word\` :  
`
const markdownFooter = `  
`
const markdownLine = `  
*****
`

const genMarkdown = function (word: any, translation: any, p: any) {
  if (!translation && !p) {
    return `- [${word}](https://translate.google.cn?text=${word}) :  本地词库暂无结果 , 查看 [Google翻译](https://translate.google.cn?text=${word}) [百度翻译](https://fanyi.baidu.com/#en/zh/${word})`
  }
  return `- [${word}](https://translate.google.cn?text=${word}) ${p ? '*/' + p + '/*' : ''}:  ${translation.replace(/\\n/g, `  `)}`
}

export async function init() {
  languages.registerHoverProvider('*', {
    async provideHover(document: TextDocument, position: Position) {
      if (!document.getWordRangeAtPosition(position)) {
        return
      }
      let word = document.getText(document.getWordRangeAtPosition(position))
      let selectText = window.activeTextEditor?.document.getText(window.activeTextEditor.selection);
      if (selectText && word.indexOf(selectText) > -1) {
        word = selectText
      }
      let originText = cleanWord(word)
      let words = getWordArray(cleanWord(word))
      let hoverText = ''
      for (let i = 0; i < words.length; i++) {
        let _w = words[i]
        let ret: any = await query(_w)
        if (i == 0) {
          hoverText += genMarkdown(_w, ret.w, ret.p)
        } else {
          hoverText += markdownLine + genMarkdown(_w, ret.w, ret.p)
        }
      }
      const header = markdownHeader.replace('$word', originText)
      hoverText = header + hoverText + markdownFooter
      console.log(hoverText)
      return new Hover(hoverText)
    }
  })
}

