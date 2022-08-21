import React, { useEffect, useState } from "react";
import { DoubleLeftOutlined } from "@ant-design/icons";
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { Link, useParams } from "react-router-dom";
import { Button, Card, Col, Modal, Row } from "antd";
import './Repolist.css'

 function Repolist() {
  const userList = useParams();
  const [repoLists, setRepoLists] = useState([]);
  const [isDisplayVisible, setIsDisplayVisible] = useState(false);
  const [readMeContent, setReadMeContent] = useState("");

  const showReadMeContent = (selectedRepo) => {
    setIsDisplayVisible(true);
    fetch(
      `https://api.github.com/repos/${userList.id}/${selectedRepo}/contents/README.md`
    )
  .then((response) => response.json())
  .then((base64) => {
    if (base64.content) {
       setReadMeContent(
        decodeURIComponent(escape(window.atob(base64.content)))
      );
    } else {
      setReadMeContent("This repostory doesn't have README file");
    }
  });
};

  const handleOk = () => {
    setIsDisplayVisible(false);
  };

  const handleCancel = () => {
    setIsDisplayVisible(false);
  };

  useEffect(() => {
    setRepoLists([]);
    fetch(`https://api.github.com/users/${userList.id}/repos`)
      .then((response) => response.json())
      .then((data) => {
        if (data !== undefined) {
          setRepoLists(data);
        } else {
          return setRepoLists(repoLists);
        }
      })
      .catch((error) => console.log(error));
  }, []);
   return (
     <div>
       <div className="repo-list-container">
        <div className="repo-container">
          <Link to= {"/"}>
            <Button
            className="back-button"
            >
              <DoubleLeftOutlined />
              Back 
            </Button>
          </Link>
          <h1 style={{fontSize: "30px"}}> Repo List </h1>
          <i style={{fontSize: "15px"}}>{repoLists.length} Repositories of the first 30 Repositories</i>
          <h2 style={{margin: "10px 0", color: "green"}}>{userList.id}</h2>
        </div>
      </div>  
      <div>
        <Row
          gutter={[12, 12]}
        >
          {repoLists.map((repoList) => {
            return (
              <Col
                key={repoList.id}
                xs={8}
                sm={8}
                md={8}
                lg={8}
                style={{ maxWidth: 300, margin: "0 auto" }}
              >
                <Card
                  title={repoList.name}
                  style={{borderRadius: "20px", backgroundColor: "#F0E68C" }}
                >
                  <div>
                    <div>
                      <h2>Open issues: {repoList.open_issues}</h2> 
                      <h2>Fork {repoList.fork}</h2>
                    </div>
                    <div>
                      <h2 style={{ fontSize: "20px" }}>
                          Watchers:  {repoList.watchers}
                      </h2> 
                    </div>
                  </div>
                  <h2 style={{fontSize: "20px", marginTop: "12px"}}>
                      Language: {""}
                     {repoList.language && (
                      <span className="repo-language" >
                        {repoList.language}
                      </span>
                    )}
                  </h2>
                  <Button
                    type="info"
                    onClick={() => showReadMeContent(repoList.name)}
                    style={{ margin: "20px auto", borderRadius: "8px", backgroundColor: "#FFDAB9" }}
                  >
                    README
                  </Button>
                  <Modal
                    allowClear
                    title="README"
                    visible={isDisplayVisible} 
                    onOk={handleOk}
                    onCancel={handleCancel}
                    mask={false}
                    width="60%"
                    height="60%"  
                  >
                    <ReactMarkdown children={readMeContent} rehypePlugins={[rehypeRaw]} />
                  </Modal>
                </Card>
              </Col>
            );
          })}
        </Row>
    </div>
  </div>
  );
}

export default Repolist;