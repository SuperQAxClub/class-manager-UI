import { Form, Input, Select, Button, Space, Card, Row, Col } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import "./form.sass";
import { FC, Fragment, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { requestSchoolGrade, requestSchoolList, requestSchoolClass, SchoolClassResponse } from '../../api/school';

const { Option } = Select;

export type ParentFormValues = {
  name: string;
  gender: string;
  phone: string;
  students: Student[];
}

export type Student = {
  id?: string;
  school: string;
  grade: string;
  gender: string;
  studentCode?:string;
  class?: string;
  studentName: string;
}

const vietnamPhoneRegex = /^(0|\+84)(3[2-9]|5[6,8,9]|7[0,6-9]|8[1-5]|9[0-9])[0-9]{7}$/;

type UserFormComponentType = {
  defaultValues:ParentFormValues,
  submitForm: (values:ParentFormValues) => void
}

export type MenuType = {
  value: string,
  label: string
}

type SchoolGradeClassType = {
  classId: string,
  className: string
}
type SchoolGradeType = {
  gradeId: string,
  gradeName: string,
  classes: SchoolGradeClassType[]
}
export type SchoolType = {
  schoolId: string,
  schoolName: string,
  grades: SchoolGradeType[]
}

export const UserFormComponent:FC<UserFormComponentType> = ({
  defaultValues, submitForm
}) => {
  const [form] = Form.useForm<ParentFormValues>();
  const [schoolData, setSchoolData] = useState<SchoolType[]>([]);
  const [schoolMenu, setSchoolMenu] = useState<MenuType[]>([]);
  const [schoolGradeMenu, setSchoolGradeMenu] = useState<MenuType[]>([]);

  // Get data
  const getSchool = async() => {
    const schoolList = await requestSchoolList();
    const tmpSchoolMenu:MenuType[] = schoolList.map(school => {return {
      value: school.id,
      label: school.name
    }})
    tmpSchoolMenu.push({
      value: "other",
      label: "Khác"
    })
    setSchoolMenu(tmpSchoolMenu);
    const grade = await requestSchoolGrade();
    const tmpSchoolGrade:MenuType[] = grade.map(grade => {return {
      value: grade.id,
      label: grade.grade.toString()
    }})
    setSchoolGradeMenu(tmpSchoolGrade);
    const allClasses = await requestSchoolClass();

    let tmpSchoolData:SchoolType[] = [];
    schoolList.forEach(school => {
      let gradeList:SchoolGradeType[] = grade.map(grade => {return {
        gradeId: grade.id,
        gradeName: grade.grade.toString(),
        classes: []
      }})
      gradeList.forEach(gradeItem => {
        const tmpClasses:SchoolGradeClassType[] = allClasses.filter(classItem => classItem.school_id === school.id && classItem.grade_id === gradeItem.gradeId).map(classItem => {return {
          classId: classItem.id,
          className: classItem.name
        }})
        gradeItem.classes = tmpClasses;
      })
      tmpSchoolData.push({
        schoolId: school.id,
        schoolName: school.name,
        grades: gradeList
      })
    })
    setSchoolData(tmpSchoolData);
  }
  const getSchoolClass = (schoolId:string, gradeId:string):MenuType[] => {
    if(schoolId && schoolId !== "other" && schoolData) {
      const findSchool = schoolData.find(school => school.schoolId === schoolId);
      if(findSchool) {
        const findGrade = findSchool.grades.find(grade => grade.gradeId === gradeId);
        if(findGrade) {
          return findGrade.classes.map(classItem => {return {
            value: classItem.classId,
            label: classItem.className
          }})
        } else {
          return [];
        }
      } else {
        return []
      }
    } else {
      return []
    }
  }

  useEffect(() => {
    getSchool();
  }, [])

  useEffect(() => {
    form.resetFields();
  }, [defaultValues])

  return (
    <Form
      form={form}
      name="parentStudentForm"
      layout="vertical"
      onFinish={submitForm}
      initialValues={ defaultValues }
    >
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Tên phụ huynh"
            name="name"
            rules={[{ required: true, message: 'Hãy nhập tên' }]}
          >
            <Input placeholder="Nhập tên phụ huynh" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={6} lg={5}>
          <Form.Item
            label="Giới tính"
            name="gender"
            rules={[{ required: true, message: 'Hãy chọn giới tính' }]}
          >
            <Select placeholder="Chọn giới tính">
              <Option value="male">Nam</Option>
              <Option value="female">Nữ</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={6} lg={7}>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: 'Hãy nhập số điện thoại' },
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
                <Form.Item shouldUpdate>
                  {({ getFieldValue }) => {
                    const id = getFieldValue(['students', name, 'id']);
                    const school = getFieldValue(['students', name, 'school']);
                    const grade = getFieldValue(['students', name, 'grade']);
                    return (
                      <Fragment>
                        <div className='form-header'>
                          <div className='header-title'>Học sinh {name + 1}</div>
                          {!id ? (
                            <div className='header-action'>
                              <Button
                                color='danger' variant='solid' size='small'
                                icon={<FontAwesomeIcon icon={faTrash} />}
                                onClick={() => remove(name)}
                              >Xoá học sinh</Button>
                            </div>
                          ) : ""}
                        </div>
                        <Row gutter={16}>
                          <Col xs={24} sm={10}>
                            {/* Trường */}
                            <Form.Item
                              {...restField}
                              label="Trường"
                              name={[name, 'school']}
                              rules={[{ required: true, message: 'Hãy chọn trường' }]}
                            >
                              {schoolMenu.length ? (
                                <Select placeholder="Chọn trường" onChange={(selectedSchool) => getSchoolClass(selectedSchool, grade)}>
                                  {schoolMenu.map(item => (
                                    <Option value={item.value}>{item.label}</Option>
                                  ))}
                                </Select>
                              ) : ""}
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={school && school !== "other" ? 14 : 8}>
                            {/* Tên học sinh */}
                            <Form.Item
                              {...restField}
                              label="Tên học sinh"
                              name={[name, 'studentName']}
                              rules={[{ required: true, message: 'Hãy nhập tên học sinh' }]}
                            >
                              <Input placeholder="Nhập tên học sinh" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={school && school !== "other" ? 4 : 3}>
                            {/* Khối */}
                            <Form.Item
                              {...restField}
                              label="Khối"
                              name={[name, 'grade']}
                              rules={[{ required: true, message: 'Hãy chọn khối' }]}
                            >
                              {schoolGradeMenu.length ? (
                                <Select placeholder="Khối">
                                  {schoolGradeMenu.map(item => (
                                    <Option value={item.value}>{item.label}</Option>
                                  ))}
                                </Select>
                              ) : ""}
                            </Form.Item>
                          </Col>
                          {school && school !== "other" ? (
                            <Col xs={24} sm={4}>
                              <Form.Item
                                {...restField}
                                label="Lớp"
                                name={[name, 'class']}
                                rules={[{ required: true, message: 'Hãy chọn lớp' }]}
                              >
                                <Select placeholder="Lớp">
                                  {getSchoolClass(school, grade).map(item => (
                                    <Option value={item.value}>{item.label}</Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>
                          ) : ""}
                          <Col xs={24} sm={school && school !== "other" ? 4 : 3}>
                            {/* Giới tính */}
                            <Form.Item
                              {...restField}
                              label="Giới tính"
                              name={[name, 'gender']}
                              rules={[{ required: true, message: 'Hãy chọn giới tính' }]}
                            >
                              <Select placeholder="Giới tính">
                                <Option value="male">Nam</Option>
                                <Option value="female">Nữ</Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          {school && school !== "other" ? (
                            <Col xs={24} sm={12}>
                              <Form.Item
                                {...restField}
                                label="Mã học sinh"
                                name={[name, 'studentCode']}
                                rules={[{ required: true, message: 'Hãy nhập mã học sinh' }]}
                                dependencies={[['students', name, 'school'], ['students', name, 'grade']]}
                              >
                                <Input placeholder="Nhập mã học sinh" />
                              </Form.Item>
                            </Col>
                          ) : ""}
                        </Row>
                      </Fragment>
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