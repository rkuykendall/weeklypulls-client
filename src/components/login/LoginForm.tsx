import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindMethods from 'class-autobind-decorator';
import _ from 'lodash';

import { message, Form, Icon, Input, Button, Checkbox } from 'antd';
import { inject } from 'mobx-react';
const FormItem = Form.Item;


@inject('store')
@autoBindMethods
class LoginForm extends Component<any> {
  handleSubmit (e) {
    e.preventDefault();

    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        try {
          await this.props.store.client.login(values.userName, values.password);
          message.success('Welcome, true believer!');
          this.props.history.push('/');
        }
        catch (e) {
          const error = _.get(e, 'response.data.non_field_errors[0]', 'Error');
          message.error(error);
        }
      }
    });
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className='login-form'>
        <h2>Log in</h2>
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder='Username' />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />} type='password' placeholder='Password' />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>Remember me</Checkbox>
          )}
          <Button className='login-form-forgot' size='small'>Forgot password</Button>
          <Button type='primary' htmlType='submit' className='login-form-button'>
            Log in
          </Button>
          Or <Button size='small' href=''>register now!</Button>
        </FormItem>
      </Form>
    );
  }

  static propTypes = {
    history: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
  }
}

const WrappedLoginForm = Form.create()(LoginForm);

export default WrappedLoginForm;
