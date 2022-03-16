import EventEmitter from 'eventemitter3';
import { SourceEvent } from '../constants';
import {
  IBaseFeature,
  IRenderType,
  ISourceData,
  ISourceOptions,
  IRenderMap,
  ISourceDataHistory,
} from '../typings';
import { cloneDeep } from 'lodash';

export class Source extends EventEmitter<SourceEvent> {
  // 数据
  data: ISourceData = {
    point: [],
    line: [],
    polygon: [],
  };

  // 渲染器对象
  render: IRenderMap = {};

  // 数据历史栈
  dataHistory: ISourceDataHistory[] = [];

  // 当前历史栈下标
  currentHistoryIndex = -1;

  constructor({ data, render }: ISourceOptions) {
    super();

    this.render = render;

    if (data) {
      this.setData(data);
    }
  }

  getRender(type: IRenderType) {
    const targetRender = this.render[type];
    if (!targetRender) {
      throw new Error('当前render并未初始化，请检查Source构造器传参');
    }
    return targetRender;
  }

  setData(newData: Partial<ISourceData>) {
    const renderTypes = Object.keys(newData) as IRenderType[];
    if (renderTypes.length) {
      this.data = {
        ...this.data,
        ...newData,
      };

      renderTypes.forEach((renderType) => {
        const renderData = newData[renderType];
        if (Array.isArray(renderData)) {
          this.getRender(renderType).setData(renderData);
        }
      });

      this.emit(SourceEvent.change, this.data);

      setTimeout(() => {
        const newDataHistory: ISourceDataHistory = {
          data: cloneDeep(this.data),
          time: Date.now(),
        };
        this.dataHistory.push(newDataHistory);
        this.currentHistoryIndex = this.dataHistory.length - 1;
      }, 0);
    }
  }

  isEmptyData() {
    return Object.values(this.data).every((value: IBaseFeature[]) => {
      return !value.length;
    });
  }

  isEmptyHistory() {
    return !this.dataHistory.length;
  }
}
