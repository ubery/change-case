import React from 'react';
import renderer from 'react-test-renderer';
import applyMarkdown, {useStyle} from './apply-markdown';

const renderFragments = frags => renderer.create(frags).toJSON();

const coolResult = [
  'be ',
  {
    type: 'b',
    props: {
      className: 'info'
    },
    children: ['cool']
  }
];

describe('applyMarkdown()', () => {
  it('should return fn that returns whole string', () => {
    expect(applyMarkdown()('dog')).toBe('dog');
    expect(applyMarkdown(null)('cat')).toBe('cat');
  });

  it('should handle string property', () => {
    let mark = applyMarkdown({'*': 'info'}),
      frag = renderFragments(mark('be *cool*'));

    expect(frag).toEqual([
      'be ',
      {
        type: 'span',
        props: {
          className: 'info'
        },
        children: ['cool']
      }
    ]);
  });

  it('should handle class component', () => {
    class Component extends React.Component {
      render() {
        return <b className="info">{this.props.children}</b>;
      }
    }
    let mark = applyMarkdown({'*': Component}),
      frag = renderFragments(mark('be *cool*'));
    expect(frag).toEqual(coolResult);
  });

  it('should handle functional component', () => {
    const Component = ({children}) => <b className="info">{children}</b>;
    let mark = applyMarkdown({'*': Component}),
      frag = renderFragments(mark('be *cool*'));
    expect(frag).toEqual(coolResult);
  });
});

describe('.useStyle', () => {
  it('should return null', () => {
    expect(useStyle()).toBe(null);
    expect(useStyle(null, null)).toBe(null);
  });

  it('should return spec object', () => {
    const spec = {
      '*': 'info'
    };
    expect(useStyle(undefined, spec)).toBe(spec);
    expect(useStyle(null, spec)).toBe(spec);
  });

  it('should transform style into spec', () => {
    const style = {
      info: 'gzVnrw',
      warn: 'jHmeYN'
    };
    const spec = {
      '*': 'info',
      '!': 'warn'
    };
    expect(useStyle(style, spec)).toEqual({
      '!': 'jHmeYN',
      '*': 'gzVnrw'
    });
  });
});
