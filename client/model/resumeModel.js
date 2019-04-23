import Base from './base.js';

class ResumeModel extends Base {
  getTemplates = params => this.$get('/api/getTemplates', params);
  getRecentInfo = params => this.$get('/api/getRecentInfo', params);
  getHotTags = params => this.$get('/api/getHotTags', params);
}

export default new ResumeModel();