import { Form, Input, Select, Button, Space, Card } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import type { Rule } from 'antd/es/form';
import { FC } from 'react';

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
      {/* === Thông tin phụ huynh === */}
      <Form.Item
        label="Tên phụ huynh"
        name="name"
        rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
      >
        <Input placeholder="Nhập tên phụ huynh" />
      </Form.Item>

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

      <Form.Item
        label="Số điện thoại"
        name="phone"
        rules={[
          { required: true, message: 'Vui lòng nhập số điện thoại' },
          { pattern: vietnamPhoneRegex, message: 'Số điện thoại không hợp lệ' },
        ]}
      >
        <Input placeholder="0xxxxxxxxx hoặc +84xxxxxxxxx" />
      </Form.Item>

      {/* === Danh sách học sinh === */}
      <Form.List name="students">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Card
                key={key}
                size="small"
                title={`Học sinh #${name + 1}`}
                style={{ marginBottom: 16 }}
                extra={
                  <MinusCircleOutlined
                    onClick={() => remove(name)}
                    style={{ fontSize: 16, color: 'red' }}
                  />
                }
              >
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

                {/* Lớp: chỉ hiển thị khi chọn trường saigon */}
                <Form.Item
                  noStyle
                  dependencies={[['students', name, 'school'], ['students', name, 'grade']]}
                >
                  {({ getFieldValue }) => {
                    const school = getFieldValue(['students', name, 'school']);
                    const grade = getFieldValue(['students', name, 'grade']) as Grade;
                    return school === 'saigon' ? (
                      <Form.Item
                        {...restField}
                        label="Lớp"
                        name={[name, 'class']}
                        rules={[{ required: true, message: 'Vui lòng chọn lớp' }]}
                      >
                        <Select placeholder="Chọn lớp">
                          {classOptions[grade]?.map((cls) => (
                            <Option key={cls} value={cls}>
                              {cls}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    ) : null;
                  }}
                </Form.Item>

                {/* Tên học sinh */}
                <Form.Item
                  {...restField}
                  label="Tên học sinh"
                  name={[name, 'studentName']}
                  rules={[{ required: true, message: 'Vui lòng nhập tên học sinh' }]}
                >
                  <Input placeholder="Nhập tên học sinh" />
                </Form.Item>
              </Card>
            ))}

            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
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
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Gửi tất cả
        </Button>
      </Form.Item>
    </Form>
  );
}