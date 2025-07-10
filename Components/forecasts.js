// data/forecasts.js
export const FORECASTS = [
    /* ─────────── SPRING ─────────── */
    {
      id: 'spring',
      title: 'Spring Fishing Forecast',
      text:
        'Spring is a great time for fishing, as water temperatures rise and fish become more active. '
        + 'This is the season for catching trout and salmon, as the water is still cool and fish are actively feeding, '
        + 'especially in areas with stronger currents. Spring is ideal for fly fishing and using live bait.',
      best: {
        name   : 'Loch Lomond, Scotland',
        desc   : 'Loch Lomond is famous for its clear waters and rich biodiversity, making it an excellent place for spring fishing.',
        fish   : 'Atlantic Salmon, Brown Trout, Rainbow Trout',
        coords : { lat: 56.0003, lon: -4.5709 },
        address: 'Loch Lomond, Alexandria, Scotland',
        img    : require('../assets/loch_lomond.png'),
      },
    },
  
    /* ─────────── SUMMER ─────────── */
    {
      id: 'summer',
      title: 'Summer Fishing Forecast',
      text:
        'Summer fishing can be slower due to warm water temperatures, so target deeper, cooler layers. '
        + 'This season is perfect for carp, pike, perch and even larger catfish.',
      best: {
        name   : 'River Wye, Herefordshire',
        desc   : 'One of the UK’s most popular summer rivers, offering flowing sections and calmer pools ideal for warm-water fishing.',
        fish   : 'Barbel, Chub, Brown Trout',
        coords : { lat: 52.1183, lon: -2.7026 },
        address: 'River Wye, Ross-on-Wye, Herefordshire',
        img    : require('../assets/wye.png'),
      },
    },
  
    /* ─────────── AUTUMN ─────────── */
    {
      id: 'autumn',
      title: 'Autumn Fishing Forecast',
      text:
        'Autumn is one of the best seasons: stable water temperatures and hungry fish stocking up for winter. '
        + 'Expect prime runs of salmon and trout, plus aggressive pike and catfish.',
      best: {
        name   : 'River Avon, Warwickshire',
        desc   : 'In autumn the Avon turns exceptionally productive thanks to ideal flows and temperatures.',
        fish   : 'Barbel, Chub, Brown Trout',
        coords : { lat: 52.2066, lon: -1.5610 },
        address: 'River Avon, Stratford-upon-Avon, Warwickshire',
        img    : require('../assets/avon.png'),
      },
    },
  
    /* ─────────── WINTER ─────────── */
    {
      id: 'winter',
      title: 'Winter Fishing Forecast',
      text:
        'Colder water slows fish activity, but you can still target hardy species like pike and perch. '
        + 'Dress warmly, use slow presentations and be patient.',
      best: {
        name   : 'Derwent Reservoir, Tyne and Wear',
        desc   : 'Offers stable water temperatures even in the coldest months—ideal for trout and perch.',
        fish   : 'Brown Trout, Rainbow Trout, Perch',
        coords : { lat: 54.9690, lon: -1.8040 },
        address: 'Derwent Reservoir, Consett, Tyne and Wear',
        img    : require('../assets/derwent.png'),
      },
    },
  ];
  