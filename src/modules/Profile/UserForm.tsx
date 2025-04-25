import { Form, Input, Select, Button, Space, Card, Row, Col } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import "./form.sass";
import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const { Option } = Select;

interface ParentFormValues {
  name: string;
  relationship: 'father' | 'mother' | 'guardian';
  phone: string;
  students: Student[];
}

type Grade = 6 | 7 | 8 | 9;

interface Student {
  school: 'saigon' | 'other';
  grade: Grade;
  class?: string;
  studentName: string;
}

const vietnamPhoneRegex = /^(0|\+84)(3[2-9]|5[6,8,9]|7[0,6-9]|8[1-5]|9[0-9])[0-9]{7}$/;

const classOptions: Record<Grade, string[]> = {
  6: ['6A1', '6A2', '6A3'],
  7: ['7A1', '7A2', '7A3'],
  8: ['8A1', '8A2', '8A3'],
  9: ['9A1', '9A2', '9A3'],
};

export const UserFormComponent:FC = () => {
  const [form] = Form.useForm<ParentFormValues>();

  const onFinish = (values: ParentFormValues) => {
    console.log('Giá trị cuối cùng:', values);
    // xử lý submit ở đây
  };

  return (
    <Form
      form={form}
      name="parentStudentForm"
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ students: [] }}
    >
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Tên phụ huynh"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
          >
            <Input placeholder="Nhập tên phụ huynh" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={6} lg={5}>
          <Form.Item
            label="Quan hệ với học sinh"
            name="relationship"
            rules={[{ required: true, message: 'Vui lòng chọn quan hệ' }]}
          >
            <Select placeholder="Chọn quan hệ">
              <Option value="father">Cha</Option>
              <Option value="mother">Mẹ</Option>
              <Option value="guardian">Người giám hộ</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={6} lg={7}>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              { pattern: vietnamPhoneRegex, message: 'Số điện thoại không hợp lệ' },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
        </Col>
      </Row>

      <Form.List name="students">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div
                key={key}
                className='student-form-container'
              >
                <div className='form-header'>
                  <div className='header-title'>Học sinh {name + 1}</div>
                  <div className='header-action'>
                    <Button
                      color='danger' variant='solid' size='small'
                      icon={<FontAwesomeIcon icon={faTrash} />}
                      onClick={() => remove(name)}
                    >Xoá học sinh</Button>
                  </div>
                </div>
                <Form.Item shouldUpdate>
                  {({ getFieldValue }) => {
                    const school = getFieldValue(['students', name, 'school']);
                    const grade = getFieldValue(['students', name, 'grade']) as Grade;
                    return (
                      <Row gutter={16}>
                        <Col xs={24} sm={10} lg={8}>
                          {/* Trường */}
                          <Form.Item
                            {...restField}
                            label="Trường"
                            name={[name, 'school']}
                            rules={[{ required: true, message: 'Vui lòng chọn trường' }]}
                          >
                            <Select placeholder="Chọn trường">
                              <Option value="saigon">Trường Trung học Thực hành Sài Gòn</Option>
                              <Option value="other">Khác</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={4}>
                          {/* Khối */}
                          <Form.Item
                            {...restField}
                            label="Khối"
                            name={[name, 'grade']}
                            rules={[{ required: true, message: 'Vui lòng chọn khối' }]}
                          >
                            <Select placeholder="Chọn khối">
                              <Option value={6}>Khối 6</Option>
                              <Option value={7}>Khối 7</Option>
                              <Option value={8}>Khối 8</Option>
                              <Option value={9}>Khối 9</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        {school === "saigon" ? (
                          <Col xs={24} sm={4}>
                            <Form.Item
                              {...restField}
                              label="Lớp"
                              name={[name, 'class']}
                              rules={[{ required: true, message: 'Vui lòng chọn lớp' }]}
                              dependencies={[['students', name, 'school'], ['students', name, 'grade']]}
                            >
                              <Select placeholder="Chọn lớp">
                                {classOptions[grade]?.map((cls) => (
                                  <Option key={cls} value={cls}>
                                    {cls}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                        ) : ""}
                        <Col xs={24} sm={school === "saigon" ? 6 : 12} lg={school === "saigon" ? 8 : 12}>
                          {/* Tên học sinh */}
                          <Form.Item
                            {...restField}
                            label="Tên học sinh"
                            name={[name, 'studentName']}
                            rules={[{ required: true, message: 'Vui lòng nhập tên học sinh' }]}
                          >
                            <Input placeholder="Nhập tên học sinh" />
                          </Form.Item>
                        </Col>
                      </Row>
                    )
                  }}
                </Form.Item>
              </div>
            ))}

            <Form.Item>
              <Button
                variant="dashed"
                onClick={() => add()}
                color="primary"
                block
                icon={<PlusOutlined />}
              >
                Thêm học sinh
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      {/* Nút gửi form */}
      <Form.Item style={{marginBottom: 0}}>
        <Button type="primary" htmlType="submit">
          Lưu thông tin
        </Button>
      </Form.Item>
    </Form>
  );
}