import Base from './base.js';

class ResumeModel extends Base {
  getHotTags = params => this.$get('/api/getHotTags', params);
}

export default new ResumeModel();