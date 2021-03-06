import {setSelection, selectionRange, rangeContent} from '@utils/selection.min';
import message from '@utils/chrome/message';

import CASE_METHODS from './scripts/cases/index';
import operators from './scripts/operators/index';
import dispatchEvent from './scripts/dispatch-event';
import dispatchError from './scripts/dispatch-error';

const INJECTED = 'changeCaseInjected';

if (window[INJECTED] === undefined) {
  window[INJECTED] = true;

  message.on('CHANGE_CASE', ({name}) => {
    const method = CASE_METHODS[name];
    if (method === undefined) {
      return;
    }

    const range = selectionRange();
    if (range.collapsed) {
      return;
    }

    const content = rangeContent(range);
    if (content.length === 0) {
      return dispatchError(range);
    }

    operators(method).then(composedMethod => {
      content.forEach(item => {
        item.selectedText = composedMethod(item.selectedText);
        dispatchEvent(item.node);
      });

      setSelection(range);
    });
  });
}
