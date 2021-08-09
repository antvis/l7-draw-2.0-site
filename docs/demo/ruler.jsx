import React from 'react';
import { Scene } from '@antv/l7';
import { DrawPolygon } from '@antv/l7-draw';
import { GaodeMap } from '@antv/l7-maps';
import { DrawControl } from '@antv/l7-draw';

const polygon2 = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [95.625, 43.068887774169625],
            [116.71874999999999, 43.068887774169625],
            [116.71874999999999, 55.97379820507658],
            [95.625, 55.97379820507658],
            [95.625, 43.068887774169625],
          ],
        ],
      },
    },
  ],
};
const polygon = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [116.30470275878906, 39.88352811449648],
            [116.32083892822264, 39.89380183825623],
            [116.31637573242188, 39.89617247892832],
            [116.30556106567381, 39.89577737784395],
            [116.30281448364258, 39.89709437260048],
            [116.28822326660156, 39.90657598772839],
            [116.27809524536131, 39.901571965464],
            [116.27843856811523, 39.880103197763546],
            [116.28822326660156, 39.87457027859936],
            [116.29131317138673, 39.85928656392012],
            [116.29371643066405, 39.852302354195864],
            [116.3129425048828, 39.853620184014325],
            [116.3393783569336, 39.85414730885731],
            [116.3448715209961, 39.85796884289976],
            [116.3448715209961, 39.87233063679467],
            [116.3422966003418, 39.885240508711654],
            [116.32564544677734, 39.889060310919994],
            [116.31465911865234, 39.88813830918363],
            [116.30470275878906, 39.88352811449648],
          ],
        ],
      },
    },
  ],
};

export default () => {
  React.useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        pitch: 0,
        style: 'light',
        center: [116.30470275878906, 39.88352811449648],
        zoom: 10,
      }),
    });
    scene.on('loaded', () => {
      const drawControl = new DrawControl(scene, {
        position: 'topright',
        layout: 'horizontal', // horizontal vertical
        controls: {
          polygon: {
            selectEnable: true,
            showFeature: true,
          },
          circle: {
            selectEnable: true,
            showFeature: true,
            showDistance: true,
          },
          line: true,
          rect: true,
          point: true,

          ruler: true,
          delete: false,
        },
      });

      scene.addControl(drawControl);
      const draw = new DrawPolygon(scene, {
        data: polygon,
      });

      draw.on('draw.create', e => {
        console.log(e);
      });
      draw.on('draw.update', e => {
        console.log('update', e);
      });
    });
  }, []);

  return (
    <div
      style={{
        height: '400px',
        position: 'relative',
      }}
      id="map"
    ></div>
  );
};
