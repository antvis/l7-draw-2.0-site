import { bindAll } from '@antv/l7';
import {
  feature,
  Feature,
  featureCollection,
  FeatureCollection,
  Point,
  Properties,
} from '@turf/helpers';
import midPoint from '@turf/midpoint';
import Draw from '../modes/draw_feature';
import BaseRender from './base_render';
import RenderFeature from './renderFeature';

const rf = RenderFeature.defaultRenderer();
export default class DrawVertexLayer extends BaseRender {
  public styleVariant = 'mid_point';

  constructor(draw: Draw) {
    super(draw);
    bindAll(['onMouseEnter', 'onClick', 'onMouseOut'], this);
  }

  public update(pointFeatures: FeatureCollection) {
    this.removeLayers();
    const midFeatures = this.calcMidPointData(pointFeatures);
    const style = this.draw.getStyle(this.styleVariant);
    this.drawLayers = rf.renderFeature(midFeatures, style);
    this.addLayers();
    this.enableEdit();
  }
  public updateData(data: any) {
    const midFeatures = this.calcMidPointData(data);
    this.drawLayers.forEach(layer => layer.setData(midFeatures));
  }
  public enableEdit() {
    const layer = this.drawLayers[0];
    layer.on('mouseenter', this.onMouseEnter);
    layer.on('mouseout', this.onMouseOut);
    layer.on('click', this.onClick);
  }

  public disableEdit() {
    const layer = this.drawLayers[0];
    layer.off('mouseenter', this.onMouseEnter);
    layer.off('mouseout', this.onMouseOut);
    layer.off('click', this.onClick);
  }

  private onMouseEnter(e: any) {
    this.draw.setCursor('pointer');
  }
  private onMouseOut(e: any) {
    this.draw.resetCursor();
  }
  private onClick(e: any) {
    if (!this.draw.getDrawable()) {
      return;
    }
    this.draw.addVertex(e.feature);
    // 添加一个顶点 1.更新顶点 2.更新重点
  }

  private calcMidPointData(fe: FeatureCollection) {
    const midFeatures: Feature[] = [];
    fe.features.forEach((item, index) => {
      const preFeature = (item as unknown) as Feature<Point, Properties>;
      if (this.draw.type === 'line' && index === fe.features.length - 1) {
        return;
      }
      const nextFeature =
        index !== fe.features.length - 1
          ? ((fe.features[index + 1] as unknown) as Feature<Point, Properties>)
          : ((fe.features[0] as unknown) as Feature<Point, Properties>);
      // @ts-ignore
      const point = midPoint(preFeature, nextFeature) as Feature<
        Point,
        Properties
      >;
      // @ts-ignore
      point.properties.id = index;
      midFeatures.push(point);
    });
    return featureCollection(midFeatures);
  }
}
