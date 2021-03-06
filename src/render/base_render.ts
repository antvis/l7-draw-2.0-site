import { IInteractionTarget, ILayer, Scene } from '@antv/l7';
const InitFeature = {
  type: 'FeatureCollection',
  features: [],
};
type CallBack = (...args: any[]) => any;
import { FeatureCollection } from '@turf/helpers';
import Draw from '../modes/draw_feature';
import { DrawEvent, DrawModes } from '../util/constant';

const rf = RenderFeature.defaultRenderer();

import RenderFeature from './renderFeature';
export default class BaseRenderLayer {
  public drawLayers: ILayer[] = [];
  protected draw: Draw;
  protected isEnableDrag: boolean;
  protected isEnableEdit: boolean;
  public styleVariant: string = 'normal'; // 用哪种style渲染

  constructor(draw: Draw) {
    this.draw = draw;
  }
  public update(feature: FeatureCollection) {
    // if (this.drawLayers.length > 0) { // 图层更新数据
    //   this.updateData(feature);
    // }
    this.removeLayers();
    this.drawLayers = rf.renderFeature(
      feature,
      this.draw.getStyle(this.styleVariant),
    );
    this.addLayers();
  }
  public on(type: any, handler: CallBack) {
    const layer = this.drawLayers[0];
    layer.on(type, handler);
  }
  public off(type: any, handler: CallBack) {
    const layer = this.drawLayers[0];
    layer.off(type, handler);
  }

  public emit(type: string, e: any) {
    const layer = this.drawLayers[0];
    layer.emit(type, e);
  }

  public updateData(data: any) {
    if (this.drawLayers.length === 0) {
      this.update(data);
    }
    this.drawLayers.forEach(layer => layer.setData(data));
  }

  public destroy() {
    this.removeLayers();
  }

  public removeLayers() {
    if (this.drawLayers.length !== 0) {
      this.drawLayers.forEach(layer => this.draw.scene.removeLayer(layer));
    }
  }
  public addLayers() {
    this.drawLayers.forEach(layer => this.draw.scene.addLayer(layer));
  }

  public show() {
    this.drawLayers.forEach(layer => layer.show());
  }

  public hide() {
    this.drawLayers.forEach(layer => layer.hide());
  }
}
