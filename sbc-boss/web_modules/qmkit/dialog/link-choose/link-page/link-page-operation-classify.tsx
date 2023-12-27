import * as React from "react";
import * as Immutable from "immutable";
import * as D2cLinkApi from "../../common/d2c-link-api";
import { exchangeCateList } from "./util";
import Category from "./category";
import ClassificationSearch from "./search";

export default class LinkPageOperationClassify extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      defaultList: [],
      cateList: [],
      selectKey: [],
    };
  }

  static displayName = "LinkPageOperationClassify";
  props: {
    apiHost: string;
    chooseData: any;
    systemCode: string;
    changeSelect: Function;
    src: string;
  };

  static defaultProps = {
    apiHost: "",
    chooseData: Immutable.Map(), //选择的对象
    systemCode: "",
    changeSelect: () => {},
    src: "",
  };

  componentDidMount() {
    this._fetchCateList();
  }
  componentWillMount() {
    this.categoryFilter(this.props.chooseData);
  }

  render() {
    let { cateList, selectKey } = this.state;

    return (
      <div className="link-page-classification">
        <ClassificationSearch
          visible={false}
          onSearch={value => {
            this._search(value);
          }}
        />
        <Category
          levelArr={[1]}
          cateList={cateList}
          selectKey={selectKey}
          changeSelect={this.handChangeSelect}
          notFoundContent="没有搜索到类目"
          style={{width: '320px'}}
        />
      </div>
    );
  }
  handChangeSelect = ({ selectedKeys, cateInfo, selectedNames }) => {
    this.props.changeSelect({
      selectedKeys,
      cataId: cateInfo.key,
      name: cateInfo.label,
      pathName: selectedNames,
    });
  };
  _search = value => {
    let { defaultList } = this.state;
    if (!value) {
      this.setState({ cateList: defaultList });
    } else {
      let arr = [];
      defaultList.forEach(item => {
        if (item.label.includes(value)) {
          arr.push(item);
        }
      });
      this.setState({ cateList: arr });
    }
  };
  categoryFilter = chooseData => {
    if (chooseData.get("key")) {
      //  老数据里是有key的
      let keyList = chooseData.get("key").split("-");
      this.setState({
        selectKey: keyList,
      });
    } else if (chooseData.get("selectedKeys")) {
      //为新数据特殊做了一层selectedKeys
      let selectedKeys = chooseData.get("selectedKeys");
      this.setState({
        selectKey: selectedKeys.toJS().slice(1),
      });
    }
  };
  /**
   * 递归分类数据 获取单选后分类的所有父元素name，字符串拼接
   */
  getCateKey = (id: string): any => {
    if (id === undefined) return;
    let list = [];
    const getKey = id => {
      const { pid, label, key } = this.getCateInfo(id);
      list.unshift({ key: key, label: label });
      if (pid !== "0") getKey(pid);
    };
    getKey(id);
    return list;
  };

  /**
   * 获取某个分类的详细信息
   */
  getCateInfo = (id: string): { pid: string; key: string; label: string } => {
    let { cateList } = this.state;
    let { pid, key, label } = cateList.find(item => item.key === id);
    return { pid, key, label };
  };
  async _fetchCateList() {
    let api_host = this.props.apiHost;
    let data;
    let url = this.props.src;
    data = await D2cLinkApi.getCateList({ api_host, url });
    const list = exchangeCateList(data);
    this.setState({
      cateList: list,
      defaultList: list
    });
  }
}
