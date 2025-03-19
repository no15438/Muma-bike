// 高德地图行政区划API
// 文档地址: https://lbs.amap.com/api/webservice/guide/api/district

// 注意: 实际使用时需要申请高德地图Key
// 申请网址: https://lbs.amap.com/dev/key/app
// 这里使用的是演示用Key，请替换为自己申请的Key
const AMAP_KEY = 'a15432ec8fda61c595fef95b81432bef'; // 请替换为您申请的Key

// 行政区域查询API地址
const DISTRICT_URL = 'https://restapi.amap.com/v3/config/district';

// 省份类型定义
export type Province = {
  id: string;
  name: string;
  level: string;
};

// 城市类型定义
export type City = {
  id: string;
  name: string;
  level: string;
};

// 区县类型定义
export type District = {
  id: string;
  name: string;
  level: string;
};

// 获取所有省份
export async function getProvinces(): Promise<Province[]> {
  try {
    const params = new URLSearchParams({
      key: AMAP_KEY,
      keywords: '中国',
      subdistrict: '1', // 返回下一级行政区
      extensions: 'base',
    });
    
    const response = await fetch(`${DISTRICT_URL}?${params.toString()}`);
    const data = await response.json();
    
    if (data.status === '1' && data.districts && data.districts.length > 0) {
      const chinaData = data.districts[0];
      if (chinaData.districts) {
        return chinaData.districts.map((province: any) => ({
          id: province.adcode,
          name: province.name,
          level: province.level
        }));
      }
    }
    
    return [];
  } catch (error) {
    console.error('获取省份数据失败:', error);
    return [];
  }
}

// 获取指定省份的城市
export async function getCities(provinceCode: string): Promise<City[]> {
  try {
    const params = new URLSearchParams({
      key: AMAP_KEY,
      keywords: provinceCode,
      subdistrict: '1', // 返回下一级行政区
      extensions: 'base',
    });
    
    const response = await fetch(`${DISTRICT_URL}?${params.toString()}`);
    const data = await response.json();
    
    if (data.status === '1' && data.districts && data.districts.length > 0) {
      const provinceData = data.districts[0];
      if (provinceData.districts) {
        return provinceData.districts.map((city: any) => ({
          id: city.adcode,
          name: city.name,
          level: city.level
        }));
      }
    }
    
    return [];
  } catch (error) {
    console.error(`获取省份(${provinceCode})的城市数据失败:`, error);
    return [];
  }
}

// 获取指定城市的区县
export async function getDistricts(cityCode: string): Promise<District[]> {
  try {
    const params = new URLSearchParams({
      key: AMAP_KEY,
      keywords: cityCode,
      subdistrict: '1', // 返回下一级行政区
      extensions: 'base',
    });
    
    const response = await fetch(`${DISTRICT_URL}?${params.toString()}`);
    const data = await response.json();
    
    if (data.status === '1' && data.districts && data.districts.length > 0) {
      const cityData = data.districts[0];
      if (cityData.districts) {
        return cityData.districts.map((district: any) => ({
          id: district.adcode,
          name: district.name,
          level: district.level
        }));
      }
    }
    
    return [];
  } catch (error) {
    console.error(`获取城市(${cityCode})的区县数据失败:`, error);
    return [];
  }
}

// 备用方案：当API请求失败时，使用本地数据
// 这只是一个简单的备用方案，实际项目中可能需要更完善的错误处理和重试机制
export const provinces = [
  { id: '110000', name: '北京市', level: 'province' },
  { id: '310000', name: '上海市', level: 'province' },
  { id: '440000', name: '广东省', level: 'province' },
  // 可以添加更多省份作为备用
];

// 备用城市数据
export const fallbackCities: Record<string, City[]> = {
  '110000': [{ id: '110100', name: '北京市', level: 'city' }],
  '310000': [{ id: '310100', name: '上海市', level: 'city' }],
  '440000': [
    { id: '440100', name: '广州市', level: 'city' },
    { id: '440300', name: '深圳市', level: 'city' },
  ],
};

// 备用区县数据
export const fallbackDistricts: Record<string, District[]> = {
  '110100': [
    { id: '110101', name: '东城区', level: 'district' },
    { id: '110102', name: '西城区', level: 'district' },
    { id: '110105', name: '朝阳区', level: 'district' },
    { id: '110106', name: '丰台区', level: 'district' },
  ],
  '310100': [
    { id: '310101', name: '黄浦区', level: 'district' },
    { id: '310104', name: '徐汇区', level: 'district' },
    { id: '310105', name: '长宁区', level: 'district' },
  ],
  '440100': [
    { id: '440103', name: '荔湾区', level: 'district' },
    { id: '440104', name: '越秀区', level: 'district' },
    { id: '440105', name: '海珠区', level: 'district' },
  ],
}; 