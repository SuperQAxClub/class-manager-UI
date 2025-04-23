import { Collapse, CollapseProps } from "antd";
import { FC } from "react";

const CourseItems:FC = () => {
  const test = [1,1,1,1,1,1]
  return (
    <>
      {test.map(item => {
        return (
          <div className="course-item">
            <div className="item-info">
              <div className="info-header">
                <div className="header-left">
                  <div className="item-content">
                    <div className="item-title">
                      <div className="title-text">Lớp 9A</div>
                      <div className="title-tag red">Chuyên</div>
                    </div>
                  </div>
                </div>
                <div className="header-right">
                  <div className="item-content">
                    <div className="item-room">
                      Phòng <b>202</b>
                    </div>
                  </div>
                </div>
              </div>
              <div className="info-body">
                <div className="info-content">
                  <div className="content-title">Thời gian khoá học</div>
                  <div className="content-desc">Từ <b>01/08/2025</b> đến <b>01/10/2025</b></div>
                  <div className="content-title">Thời gian học</div>
                  <div className="content-desc">
                    Thứ 2: từ <b>18:00</b> đến <b>20:00</b>
                    <br />Thứ 4: từ <b>16:00</b> đến <b>18:00</b>
                  </div>
                </div>
                <div className="info-slots">
                  Còn <b>999</b> chỗ
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}

export const CourseListComponent:FC = () => {
  const subjectList: CollapseProps['items'] = [
    {
      key: '1',
      label: 'Khoa học tự nhiên',
      children: <CourseItems />,
    },
    {
      key: '2',
      label: 'Toán',
      children: <CourseItems />,
    }
  ];
  return (
    <Collapse items={subjectList} defaultActiveKey={['1']}  />
  )
}