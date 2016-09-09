/**
 * Styles
 */
export default function styles(color = '#009EE3') {
  return {
    paymentForm: {
      boxSizing: 'border-box',
      fontFamily: 'Courier, monospace',
    },

    fieldList: {
      boxSizing: 'border-box',
      padding: '20px 40px 40px',
      background: '#FFF',
    },

    field: {
      margin: '0 0 12px',
      padding: '0',
      boxSizing: 'border-box',
    },

    field_label: {
      position: 'absolute',
      zIndex: '-1',
    },

    field_input: {
      color: '#000',
      width: '100%',
      padding: '10px 10px 14px',
      border: '0 solid',
      borderBottomWidth: '1px',
      borderBottomColor: '#DDD',
      boxShadow: '0 -1px 0 #FFF inset',
      borderRadius: '0',
      boxSizing: 'border-box',
      fontSize: '1em',
      fontFamily: 'Courier, monospace',
      transition: 'all 0.3s',
    },

    field_input_focus: {
      outline: '0',
      borderBottomColor: color,
      boxShadow: `0 -1px 0 ${color} inset`,
    },

    field_select: {
      background: 'none',
      borderBottomColor: 'transparent',
    },

    field_alt: {
      display: 'inline-block',
      width: '50%',
      paddingRight: '20px',
    },

    submit: {
      outline: '0',
      boxSizing: 'border-box',
      margin: '-12px 0 0',
      padding: '0 40px 40px',
      background: '#FFF',
      borderRadius: '0 0 4px 4px',
      fontSize: '100%',
    },

    submit_button: {
      margin: '0',
      outline: '0',
      boxSizing: 'border-box',
      padding: '18px 0',
      fontSize: '1em',
      border: '0',
      cursor: 'pointer',
      color: '#FFF',
      textShadow: '0 0 3px rgba(0, 0, 0, 0.4)',
      width: '100%',
      background: color,
      borderRadius: '4px',
      boxShadow: '1px 2px 8px rgba(0, 0, 0, 0.1), 0 0 1px rgba(0, 0, 0, 0.5) inset',
      fontFamily: 'Courier, monospace',
    },
  };
}
