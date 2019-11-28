import { HTTP_METHODS } from './constant';
import { Dict } from '@mohism/utils';
import { Excutable } from '../common/type';
import MohismError from '../../../utils/mohism-error';

/**
 * tree base route
 */

export type Layer = {
  name: string;
  handler?: Excutable;
  next: Dict<Layer>;
}

/**
 * 
 * @param steps {Array<string>} must contains atleast one element
 * @param layerDict 
 */
const fetchRecurse = (steps: Array<string>, layerDict: Dict<Layer>): Excutable | undefined => {
  const step: string = steps[0];
  
  let result: Excutable | undefined = undefined;
  if (layerDict[step]) {
    const [, ...restSteps] = steps;
    if (restSteps.length === 0) {
      result = layerDict[step].handler;
    } else {
      result = fetchRecurse(restSteps, layerDict[step].next);
    }
  }

  if (layerDict['*']) {
    const [, ...restSteps] = steps;
    if (restSteps.length === 0) {
      result =  layerDict['*'].handler;
    }else{
      result = result || fetchRecurse(restSteps, layerDict['*'].next);
    }
  }
  return result;
}

class Router {
  private tree: Dict<Layer>;
  constructor() {
    this.tree = {};
  }

  /**
   * 
   * @param method {HTTP_METHODS}
   * @param url {string}
   * @param fn {}
   */
  register(method: HTTP_METHODS, url: string, fn: Excutable) {
    const steps: Array<string> = [HTTP_METHODS[method], ...(url.split('/'))];
    let tree: Dict<Layer> = this.tree;
    steps.forEach((step: string, index: number) => {
      if (step === '') {
        return;
      }
      if (step.startsWith(':') || (step.startsWith('{') && step.endsWith('}'))) {
        step = '*';
      }
      tree[step] = tree[step] || { name: step, next: {} };

      if (index === steps.length - 1) {
        tree[step].handler = fn;
      } else {
        tree = tree[step].next as Dict<Layer>;
      }
    });
  }

  fetch(method: HTTP_METHODS, url: string): Excutable | undefined {
    const steps: Array<string> = [HTTP_METHODS[method], ...(url.split('/').filter(item => item != ''))];
    let tree: Dict<Layer> = this.tree;

    const result: Excutable | undefined = fetchRecurse(steps, tree);
    if (result === undefined) {
      throw new MohismError('not found').statusCode(404);
    }
    return result;
  }

  treeToString(): string {
    return JSON.stringify(this.tree);
  }
}

export const Route = (): Router => {
  return new Router();
}