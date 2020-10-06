const accessToken = 'pk.eyJ1Ijoic3RlcGhlbnNoaWVsZHMiLCJhIjoiY2tmd2Nza2dxMGFhejJzbzhhYjV0cHBveSJ9.w1g3ZFeYfb02gYPMM60oPg';

export const mapServices = [
  {
    name: 'OpenStreetMap',
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  },
  {
    name: 'Mapbox',
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    url: `https://api.mapbox.com/styles/v1/stephenshields/ckfs8tp4r1w5619t8t7gqlbl3/tiles/256/{z}/{x}/{y}@2x?access_token=${accessToken}`,
  },  
];
