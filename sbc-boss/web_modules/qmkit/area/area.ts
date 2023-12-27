import { fromJS } from 'immutable';
import provinces from './provinces.json';
import cities from './cities.json';
import areas from './areas.json';
import streets from './streets.json';


/**
 * 获取省份与地市的层级结构数据
 */
export function findProvinceCity(ids) {
  return fromJS(provinces || [])
    .map(p => {
      let pChx = false,
        cChx = false,
        pChx2 = false;
      if (fromJS(ids).find(id => id == p.get('code'))) {
        pChx = true;
      }
      let children = p.get('children').map(c => {
        cChx = pChx;
        if (!cChx && fromJS(ids).find(id => id == c.get('value'))) {
          cChx = true;
          pChx2 = true;
        }
        return fromJS({
          label: c.get('label'),
          value: c.get('value'),
          key: c.get('value'),
          disabled: cChx
        });
      });
      return fromJS({
        label: p.get('name'),
        value: p.get('code'),
        key: p.get('code'),
        children: children,
        disabled: pChx || pChx2
      });
    })
    .toJS();
}

export function findProvinceArea(ids) {
  return fromJS(provinces || [])
    .map(p => {
      let pChx = false,
        cChx = false,
        pChx2 = false;
      if (fromJS(ids).find(id => id == p.get('code'))) {
        pChx = true;
      }
      let children = p.get('children').map(c => {
        cChx = pChx;
        if (!cChx && fromJS(ids).find(id => id == c.get('value'))) {
          cChx = true;
          pChx2 = true;
        }
        return fromJS({
          label: c.get('label'),
          value: c.get('value'),
          key: c.get('value'),
          children: c.get('children'),
          disabled: cChx
        });
      });
      return fromJS({
        label: p.get('name'),
        value: p.get('code'),
        key: p.get('code'),
        children: children,
        disabled: pChx || pChx2
      });
    })
    .toJS();
}


/**
 * 查询省
 * @param code
 * @returns {string}
 */
export function findProviceName(code: string) {
  for (let p of provinces) {
    if (p.code == code) {
      return p.name;
    }
  }
  return '';
}

export function findProviceItemWithCityCode(cityCode: string) {
  let findItem = null
  for (const item of cities) {
    if (cityCode == item.code) {
      findItem = { ...item };
      break
    }
  }
  if (findItem) {
    for (const item of provinces) {
      if (findItem.parent_code == item.code) {
        findItem = { 
          label: item.name,
          value: item.code
         };
        break
      }
    }
  }
  return findItem;
}

export function findArea(code: string) {
  for (let a of areas) {
    if (code == a.code) {
      return a.name;
    }
  }
  return '';
}

export function findCity(code: string) {
  for (let c of cities) {
    if (code == c.code) {
      return c.name;
    }
  }
  return '';
}

export function findStreet(code: string) {
  for (let a of streets) {
    if (code == a.code) {
      return a.name;
    }
  }
  return '';
}

/**
 * 查询对应的街道数据
 * @param code 根据code查询对应的街道数据
 * @returns null | {key: string, value: string, title: string, parent_code: string}
 */
export function findStreetItem(code: string) {
  for (let a of streets) {
    if (code == a.code) {
      return { ...a };
    }
  }
  return null;
}

export function findStreetAllData(streetCode: string) {
  const arr = []
  let tmpItem = null
  for (let a of streets) {
    if (streetCode == a.code) {
      const item = { ...a };
      arr.unshift({
        label: item.name,
        value: item.code,
        key: item.code
      })
      tmpItem = item
      break
    }
  }
  if (tmpItem) {
    for (const a of areas) {
      if (tmpItem.parent_code == a.code) {
        const areaItem = { ...a };
        arr.unshift({
          label: areaItem.name,
          value: areaItem.code,
          key: areaItem.code
        })
        tmpItem = areaItem
        break
      }
    }
  }
  if (tmpItem) {
    for (const a of cities) {
      if (tmpItem.parent_code == a.code) {
        const cityItem = { ...a };
        arr.unshift({
          label: cityItem.name,
          value: cityItem.code,
          key: cityItem.code
        })
        tmpItem = cityItem
        break
      }
    }
  }
  if (tmpItem) {
    for (const a of provinces) {
      if (tmpItem.parent_code == a.code) {
        const proviceItem = { ...a };
        arr.unshift({
          label: proviceItem.name,
          value: proviceItem.code,
          key: proviceItem.code
        })
        tmpItem = proviceItem
        break
      }
    }
  }
  return arr;
}

export function findCityAndParentId(code: string) {
  for (let c of cities) {
    if (code == c.code) {
      return { name: c.name, parent_code: c.parent_code };
    }
  }
  return { name: null, parent_code: null };
}

/**
 *  省市区字符串 返回 `江苏省/南京市/雨花台区`
 * @param provinceCode
 * @param cityCode
 * @param areaCode
 * @param splitter 分隔符
 * @returns {string}
 */
export function addressInfo(provinceCode, cityCode, areaCode, splitter = '') {
  if (provinceCode) {
    if (cityCode) {
      let proviceName = `${findProviceName(provinceCode)}`;
      let cityName = `${findCity(cityCode)}`;

      if (proviceName === cityName) {
        return `${cityName}${splitter}${findArea(areaCode)}`;
      } else {
        return `${proviceName}${cityName}${findArea(areaCode)}`;
      }
    } else {
      return `${findProviceName(provinceCode)}`;
    }
  }

  return '请选择所在地区';
}

/**
 *  省市区街道字符串 返回 `江苏省/南京市/雨花台区/xx街道`
 * @param provinceCode
 * @param cityCode
 * @param areaCode
 * @param splitter 分隔符
 * @returns {string}
 */
export function addressStreetInfo(provinceCode, cityCode, areaCode, streetCode) {
  if (provinceCode) {
    if (cityCode) {
      let proviceName = `${findProviceName(provinceCode)}`;
      let cityName = `${findCity(cityCode)}`;

      if (proviceName === cityName) {
        return `${cityName}${findArea(areaCode)}${findStreet(streetCode)}`;
      } else {
        return `${proviceName}${cityName}${findArea(areaCode)}${findStreet(streetCode)}`;
      }
    } else {
      return `${findProviceName(provinceCode)}`;
    }
  }

  return '请选择所在地区';
}

/**
 * 获取指定城市下的区和街道数据
 * @param cityCode 城市code
 * @returns Array
 */
export function getCityDatas(cityCode: string) {
  let areaData = areas.filter((item) => {
    return item.parent_code == cityCode
  }).map(city => {
    city.key = city.code
    city.value = city.code
    city.title = city.name
    city.label = city.name
    city.selectable = false
    return { ...city }
  })
  areaData = areaData.map((area) => {
    area.children = streets
      .filter((street) => street.parent_code == area.code)
      .map(street => {
        street.key = street.code
        street.value = street.code
        street.title = street.name
        street.label = street.name
        return { ...street }
      })
    return area
  })
  return areaData
}

/**
 * 获取指定省市的省市区街道全部数据
 */
export function findProvinceCityAreaStreet(provinceCodes = [], cityCodes = []) {
  return provinces.filter(province => {
    return provinceCodes.indexOf(province.code) > -1
  }).map(item => {
    const proviceItem = {
      ...item,
      key: item.code,
      value: item.code,
      title: item.name,
      disableCheckbox: true
    }
    proviceItem.children = cities.filter(item2 => {
      return item2.parent_code == proviceItem.code && cityCodes.indexOf(item2.code) > -1
    }).map(item2 => {
      const cityItem = {
        ...item2,
        key: item2.code,
        value: item2.code,
        title: item2.name,
        disableCheckbox: true
      }
      cityItem.children = areas.filter(item3 => item3.parent_code == item2.code).map(item3 => {
        const areaItem = {
          ...item3,
          key: item3.code,
          value: item3.code,
          title: item3.name,
          disableCheckbox: true
        }
        areaItem.children = streets.filter(item4 => item4.parent_code == item3.code).map(item4 => {
          const streetItem = {
            ...item4,
            key: item4.code,
            value: item4.code,
            title: item4.name
          }
          return streetItem
        })
        return areaItem
      })
      return cityItem
    })
    return proviceItem
  })
}

export function findProvinceCityAreaStreet2() {
  const fn = (data) => {
    data = data.map(item => {
      const tmp = item
      return {
        ...item,
        key: tmp.value || tmp.code, 
        value: tmp.value || tmp.code, 
        title: tmp.label || tmp.name, 
        selectable: `${tmp.value || tmp.code}`.length > 5 ? true: false,
        children: tmp.children ? fn(tmp.children) : null
      }
    })
    return data
  }
  return fn(provinces)
}

export function findProvinceCityAreaStreetChooseToStreet() {
  const fn = (data) => {
    data = data.map(item => {
      const tmp = item
      return {
        ...item,
        key: tmp.value || tmp.code, 
        value: tmp.value || tmp.code, 
        title: tmp.label || tmp.name, 
        label: tmp.label || tmp.name,
        selectable: !tmp.children,
        children: tmp.children ? fn(tmp.children) : null
      }
    })
    return data
  }
  return fn(provinces)
}

export function findProvinceCityData() {
  return provinces.map(item => {
    const proviceItem = { 
      ...item, 
      key: item.code, 
      value: item.code, 
      title: item.name
    }
    proviceItem.children = cities.filter(item2 => item2.parent_code == proviceItem.code).map(item2 => {
      const cityItem = { 
        ...item2, 
        key: item2.code, 
        value: item2.code, 
        title: item2.name 
      }
      cityItem.children = []
      return cityItem
    })
    return proviceItem
  })
}