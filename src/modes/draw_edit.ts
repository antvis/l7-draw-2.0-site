import { IInteractionTarget, ILngLat, Scene } from '@antv/l7';
import { Feature, Units } from '@turf/helpers';
import { DrawEvent } from '../util/constant';
import { IDrawFeatureOption } from './draw_feature';
import DrawMode from './draw_mode';

export default class DrawEdit extends DrawMode {
  private endPoint: ILngLat;
  // 绘制完成之后显示
  constructor(scene: Scene, options: Partial<IDrawFeatureOption> = {}) {
    super(scene, options);
  }

  public setEditFeature(feature: Feature) {
    this.currentFeature = feature;
  }

  protected onDragStart = (e: IInteractionTarget) => {
    // @ts-ignore
  };

  protected getDefaultOptions() {
    return {
      steps: 64,
      units: 'kilometers' as Units,
      cursor: 'move',
    };
  }

  protected onDragging = (e: IInteractionTarget) => {
    this.endPoint = e.lngLat;
    this.emit(DrawEvent.Edit, this.endPoint);
    return;
  };

  protected onDragEnd = () => {
    this.emit(DrawEvent.UPDATE, this.currentFeature);
    this.resetCursor();
    this.disable();
  };
  protected onClick = () => {
    return null;
  };
}
