import { useEffect, useState } from "react";

import "./App.css";
import axios from "axios";

export type ListTemplateLayer = ILayer[];

export interface ILayer {
  layer: string;
  type: string;
  color?: string;
  text?: string;
  background?: string;
  font_family?: string;
  image_url?: string;
  border_width?: string;
  border_color?: string;
  hide?: boolean;
}

export type ListTemplate = ITemplate[];

export interface ITemplate {
  id: string;
  type: string;
  name: string;
  description: string;
  width: number;
  height: number;
  isMaster: boolean;
  userId: string;
  html: string;
  thumbnail: string;
  categoryId: string;
  folderId: string;
  tags: string;
  createdAt: string;
  updatedAt: string;
}

const API_KEY = "a4e4c162-7d77-42ee-acb1-be8ebb463b0c";
function App() {
  const [listTemplates, setListTemplates] = useState<ListTemplate | undefined>(
    undefined
  );
  const [listTemplateLayer, setListTemplateLayer] = useState<
    ListTemplateLayer | undefined
  >(undefined);

  const [payload, setPayload] = useState<any>(); //eslint-disable-line

  const [templateId, setTemplateId] = useState("");

  const [resultTemplate, setResultTemplate] = useState<any>(); //eslint-disable-line

  const fetchDetailTemplate = async (id: string) => {
    try {
      const res = await axios({
        url: `https://api.templated.io/v1/template/${id}/layers/`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      });
      // Process the response data here
      setTemplateId(id);
      setListTemplateLayer(res.data);
    } catch (error) {
      // Handle errors here
      console.error("Error fetching data:", error);
    }
  };
  const getListTemplate = async () => {
    try {
      const res = await axios({
        url: "https://api.templated.io/v1/templates",
        method: "GET",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      });
      // Process the response data here
      console.log(res.data);
      setListTemplates(res.data);
    } catch (error) {
      // Handle errors here
      console.error("Error fetching data:", error);
    }
  };
  //eslint-disable-next-line
  const handleRender = (template_id: string, layers: any) => {
    axios("https://api.templated.io/v1/render", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      data: JSON.stringify({
        template: `${template_id}`,
        layers: layers,
      }),
    }).then((res) => {
      setResultTemplate(res.data);
    });
  };

  useEffect(() => {
    getListTemplate(); // Call the async function immediately
  }, []);

  return (
    <>
      <div>
        {listTemplateLayer ? (
          <>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <h1>Detail Layer</h1>
              {listTemplateLayer.map((layer, index) => (
                <>
                  {layer.type === "text" && (
                    <div
                      key={index}
                      style={{ display: "flex", flexDirection: "column" }}
                    >
                      <p>{layer.layer}</p>
                      <input
                        type="text"
                        placeholder="text"
                        onChange={(e) => {
                          //eslint-disable-next-line
                          setPayload((prev: any) => {
                            const newParams = prev;
                            if (newParams) {
                              newParams[layer.layer] = { text: e.target.value }; //eslint-disable-line
                              return newParams;
                            }
                          });
                        }}
                      />
                    </div>
                  )}
                  {layer.type === "image" && (
                    <div
                      key={index}
                      style={{ display: "flex", flexDirection: "column" }}
                    >
                      <p>{layer.layer}</p>
                      <input
                        type="text"
                        placeholder="image_url"
                        onChange={(e) => {
                          //eslint-disable-next-line
                          setPayload((prev: any) => {
                            const newParams = prev;
                            newParams[layer.layer] = {
                              image_url: e.target.value,
                            };
                            return newParams;
                          });
                        }}
                      />
                    </div>
                  )}
                </>
              ))}
              <button
                style={{ marginTop: "20px", marginBottom: "20px" }}
                onClick={() => handleRender(templateId, payload)}
              >
                Submit
              </button>
              {resultTemplate && (
                <img
                  style={{ width: "500px" }}
                  src={resultTemplate?.render_url}
                  alt=""
                />
              )}
            </div>
          </>
        ) : (
          <>
            <h1>LIST TEMPLATES</h1>
            {listTemplates &&
              listTemplates?.map((template) => (
                <button onClick={() => fetchDetailTemplate(template.id)}>
                  {template.name}
                </button>
              ))}
          </>
        )}
      </div>
    </>
  );
}

export default App;
