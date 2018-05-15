export default {
  pages: {
    "/print": { document: './src/pages/print.ejs' },
  },
  plugins: ['umi-plugin-dva'],
  hashHistory: true,
  context: {
    title: '雪冰电商',
  },
}
