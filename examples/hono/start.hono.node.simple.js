import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { requestId } from 'hono/request-id';

const [PORT_STRING = '8080'] = process.argv.slice(2);
const PORT = Number(PORT_STRING);

const app = new Hono();

app.use('*', requestId());

app.all('/*', (c) => {
  c.res.headers.set('server', 'server name');
  c.res.headers.set('referrer-policy', 'same-origin');
  c.res.headers.set('x-content-type-options', 'nosniff');
  c.res.headers.set('x-frame-options', 'DENY');
  c.res.headers.set('x-xss-protection', '1;mode=block');
  c.res.headers.set('cache-control', 'max-age=180');
  c.res.headers.set('last-modified', 'Sun, 27 Oct 2024 10:17:29 GMT');
  c.res.headers.set('x-request-id', c.get('requestId'));

  return c.json({
    message: 'Hello world!',
    firstname: c.req.query('firstname'),
    lastname: c.req.query('lastname'),
    paragraphs: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras lacus elit, dictum eu odio at, mattis vestibulum dui. Maecenas nunc lacus, porttitor vel luctus ac, mollis vel lacus. Pellentesque pulvinar egestas ligula sed rhoncus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec vitae pharetra elit. Donec volutpat, arcu vel lacinia ultrices, diam lectus ullamcorper est, a accumsan lorem velit et sapien. Sed interdum faucibus arcu ac facilisis. Aenean luctus quam eget mauris placerat, a congue purus pretium. Curabitur tristique scelerisque tortor. Nullam rhoncus ornare consectetur. Aenean in felis sed libero gravida tempor nec quis arcu. Nulla ac pharetra magna. Aenean a convallis urna. Integer vel nisi sit amet felis varius gravida non vel lacus. Etiam erat est, molestie sed faucibus eget, scelerisque ut est. Vestibulum a ligula porttitor metus tempus euismod.',
      'Maecenas et justo pretium, ultricies ipsum et, condimentum arcu. Cras volutpat arcu urna, et aliquet justo pharetra id. Nunc ut mi augue. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque viverra neque quis euismod hendrerit. Nunc blandit mi vitae velit venenatis volutpat. Aliquam purus urna, lacinia in velit vitae, laoreet efficitur diam. Donec tincidunt quam vel magna feugiat, vitae faucibus tellus elementum. In hendrerit rutrum euismod. Sed mauris lacus, finibus vel aliquet eu, congue eu sapien.',
      'Maecenas dolor felis, sodales eget dolor eget, tempus cursus lacus. Donec dapibus orci id eleifend pharetra. Sed sagittis vulputate ante, eget molestie augue feugiat eu. Aliquam et condimentum risus. Proin libero enim, commodo a quam in, rhoncus placerat nisl. Nullam elit lacus, interdum ac porta id, malesuada sed dolor. Quisque non ex et tellus rutrum varius eu eu lectus.',
      'Sed eget erat interdum, congue arcu quis, efficitur justo. Nulla auctor, felis vel facilisis vestibulum, quam est iaculis risus, vel porttitor neque neque ac felis. Fusce pretium tempus dui, id imperdiet orci ultricies sed. In hac habitasse platea dictumst. Proin ultrices, tortor sit amet luctus dictum, est turpis facilisis nunc, non fringilla ante lorem ac neque. Duis ornare ornare dolor, eget scelerisque purus vestibulum sed. Maecenas commodo metus a blandit pellentesque. Aenean eu enim id turpis auctor iaculis. Nunc elementum mollis sagittis. Ut faucibus tempus orci. Ut id ante maximus, interdum leo ac, lobortis magna. Ut sollicitudin felis in commodo pharetra.',
      'Mauris sit amet diam lacus. Vivamus aliquam, risus id placerat aliquet, sem felis feugiat diam, in porttitor nunc est non quam. In lacus sem, tincidunt gravida dignissim in, lacinia vel tortor. Duis ultrices ac ligula ut vehicula. Nullam pretium ante id tortor condimentum, sed elementum magna tristique. Suspendisse potenti. Morbi vitae scelerisque erat. Nunc eu leo accumsan, mollis lectus at, maximus dolor. Ut maximus laoreet lacus a dapibus. Nam fermentum erat a ullamcorper ultricies. Morbi suscipit interdum risus, at fringilla turpis dictum commodo. Maecenas id nibh condimentum, finibus libero quis, luctus nulla. Nulla ut porta tellus. Cras at ultrices libero. Ut ut odio eget nulla interdum egestas. Praesent ut justo nibh.',
      'Nam iaculis, metus non hendrerit eleifend, arcu nisl molestie urna, eu ornare felis justo sed purus. Etiam non tellus est. Nunc sit amet tincidunt urna, at condimentum libero. Donec scelerisque, urna vitae molestie elementum, turpis eros mollis massa, at fermentum purus massa in lectus. Morbi imperdiet ipsum at congue bibendum. Aenean eu sagittis ligula. Duis commodo convallis felis a accumsan. Vivamus ac dolor in tellus pulvinar aliquam. Suspendisse maximus tristique vehicula. Mauris finibus varius odio sit amet posuere. Duis lacinia nunc ullamcorper leo convallis dictum id tristique tellus.',
      'Duis molestie facilisis metus sed dapibus. Nullam fringilla dignissim nisi, sit amet volutpat elit consequat vitae. Proin dictum lorem sed eros faucibus, ac fermentum nibh malesuada. Nulla facilisi. Ut non lacus non leo posuere ornare a in mauris. Ut hendrerit erat at cursus ultricies. Duis nibh nibh, tincidunt nec dignissim sed, dictum in orci. Donec id enim sed augue pharetra vulputate. Etiam finibus nunc a ullamcorper hendrerit. Vivamus vitae feugiat nibh, id porttitor augue. Sed lacinia aliquam lectus, id placerat purus lacinia ac. Sed a maximus tellus, id tincidunt arcu.',
      'Proin lacinia sapien euismod libero suscipit, a efficitur felis ullamcorper. Sed tempus ornare vulputate. In lobortis lacus purus, in dictum mi placerat non. Pellentesque ex magna, euismod sed consectetur dignissim, placerat ut ipsum. Mauris vehicula bibendum justo vitae semper. Vivamus ante mauris, ultrices ac eros malesuada, tempor dapibus nunc. Mauris malesuada leo nec porta euismod. Curabitur fermentum convallis maximus. Proin vehicula efficitur nibh, at dignissim sem ullamcorper eu.',
      'Proin at molestie augue. Sed vehicula augue ac ullamcorper interdum. Ut arcu est, eleifend id accumsan ut, tristique ut enim. Aliquam interdum posuere dolor, sit amet mattis nibh elementum in. Donec gravida ultrices nibh, id bibendum dui ullamcorper ac. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nunc ut purus magna.',
      'Pellentesque non porta tortor, sed mollis quam. Fusce consequat mi ac pellentesque maximus. Maecenas dictum fringilla lectus eget sagittis. Duis erat eros, finibus id scelerisque a, rutrum et ante. Praesent quis tellus eget nisi aliquam lobortis. Duis dignissim sapien fermentum orci rutrum, lobortis ultrices nibh porttitor. Vivamus et eros id nulla viverra tempor a eu lorem. Nulla facilisi. Donec tempus suscipit nibh et feugiat. Curabitur sed magna mauris. Aliquam erat volutpat. Integer magna mauris, luctus ac tincidunt dapibus, facilisis id eros. Ut elementum eget ex ac congue.',
    ],
  });
});

console.log(`[Hono] is running on port ${PORT} ...`);

serve({
  fetch: app.fetch,
  port: PORT,
});
