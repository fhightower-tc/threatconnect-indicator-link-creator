var INDICATORLINKCREATOR = INDICATORLINKCREATOR || {};

// register an indicator link component
Vue.component('indicator-link', {
  props: ['indicator'],
  template: '<p>[[{{ indicator.type }}:{{ indicator.indicator }}]]</p>'
});

INDICATORLINKCREATOR.app = new Vue({
  el: '#link-panel',
  data: {
    indicatorArray: [],
    seen: false
  }
});

INDICATORLINKCREATOR.getAssociatedIndicators = function() {
    var groupType = getParameterByName("tcType");
    var groupId = getParameterByName("tcSelectedItem");
    var indicatorArray = [];

    // get creds to initialize a TC instance
    var tcSpaceElementId = getParameterByName('tcSpaceElementId');

    if (tcSpaceElementId) {
        var apiSettings = {
            apiToken: getParameterByName('tcToken'),
            apiUrl: getParameterByName('tcApiPath')
        };
    }
    // initialize a tc instance
    var tc = new ThreatConnect(apiSettings);

    // retrieve all indicators associated with the given group
    tc.groups()
        .type(groupType)
        .id(groupId)
        .done(function(response) {
            response.data.forEach(function(indicator) {
                // push the appropriate indicator data onto the array
                indicatorArray.push({type: indicator.type, indicator: indicator.indicator});
            });

            // set the apps value
            INDICATORLINKCREATOR.app.indicatorArray = indicatorArray;

            // make the app visible
            INDICATORLINKCREATOR.app.seen = true;
        })
        .error(function(response) {
            console.error('error response', response);
        })
        .retrieveAssociations({
            type: TYPE.INDICATOR
        });
}
