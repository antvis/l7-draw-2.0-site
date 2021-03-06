import { IInteractionTarget, ILngLat, Scene } from '@antv/l7';
import { Feature } from '@turf/helpers';
import { DrawEvent } from '../util/constant';
import { IDrawFeatureOption } from './draw_feature';
import DrawMode from './draw_mode';

const InitFeature = {
  type: 'FeatureCollection',
  features: [],
};
export default class DrawSelect extends DrawMode {
  private center: ILngLat;
  private dragStartPoint: ILngLat;
  // 绘制完成之后显示
  constructor(scene: Scene, options: Partial<IDrawFeatureOption> = {}) {
    super(scene, options);
  }

  public setSelectedFeature(feature: Feature) {
    this.currentFeature = feature;
  }

  protected onDragStart(e: IInteractionTarget) {
    this.scene.setMapStatus({ dragEnable: false });
    this.dragStartPoint = e.lngLat;
  }

  protected getDefaultOptions(): Partial<IDrawFeatureOption> {
    return {
      steps: 64,
      units: 'kilometers',
      cursor: 'move',
    };
  }

  protected onDragging(e: IInteractionTarget) {
    const delta = {
      lng: e.lngLat.lng - this.dragStartPoint.lng,
      lat: e.lngLat.lat - this.dragStartPoint.lat,
    };
    this.emit(DrawEvent.Move, delta);
    this.dragStartPoint = e.lngLat;
    return;
  }

  protected onDragEnd() {
    this.emit(DrawEvent.UPDATE, this.currentFeature);
  }
  protected onClick() {
    return null;
  }
}
