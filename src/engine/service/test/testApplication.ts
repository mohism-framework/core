import { Logger } from "@mohism/utils";
import BaseApplication from "../common/abstractApplication";

const logger = Logger();

export default class TestApplication extends BaseApplication {
  /* istanbul ignore next */
  async boot(){
    logger.info('you boot a(n) testcase application.');
  }

}


