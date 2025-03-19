// 中国省份数据
export const provinces = [
  { id: '11', name: '北京市' },
  { id: '12', name: '天津市' },
  { id: '13', name: '河北省' },
  { id: '14', name: '山西省' },
  { id: '15', name: '内蒙古自治区' },
  { id: '21', name: '辽宁省' },
  { id: '22', name: '吉林省' },
  { id: '23', name: '黑龙江省' },
  { id: '31', name: '上海市' },
  { id: '32', name: '江苏省' },
  { id: '33', name: '浙江省' },
  { id: '34', name: '安徽省' },
  { id: '35', name: '福建省' },
  { id: '36', name: '江西省' },
  { id: '37', name: '山东省' },
  { id: '41', name: '河南省' },
  { id: '42', name: '湖北省' },
  { id: '43', name: '湖南省' },
  { id: '44', name: '广东省' },
  { id: '45', name: '广西壮族自治区' },
  { id: '46', name: '海南省' },
  { id: '50', name: '重庆市' },
  { id: '51', name: '四川省' },
  { id: '52', name: '贵州省' },
  { id: '53', name: '云南省' },
  { id: '54', name: '西藏自治区' },
  { id: '61', name: '陕西省' },
  { id: '62', name: '甘肃省' },
  { id: '63', name: '青海省' },
  { id: '64', name: '宁夏回族自治区' },
  { id: '65', name: '新疆维吾尔自治区' },
  { id: '71', name: '台湾省' },
  { id: '81', name: '香港特别行政区' },
  { id: '82', name: '澳门特别行政区' }
]

// 部分常用城市数据
export const cities: Record<string, Array<{id: string, name: string}>> = {
  '11': [ // 北京市
    { id: '1101', name: '北京市' }
  ],
  '31': [ // 上海市
    { id: '3101', name: '上海市' }
  ],
  '44': [ // 广东省
    { id: '4401', name: '广州市' },
    { id: '4403', name: '深圳市' },
    { id: '4406', name: '佛山市' },
    { id: '4413', name: '惠州市' },
    { id: '4419', name: '东莞市' },
    { id: '4420', name: '中山市' }
  ],
  '32': [ // 江苏省
    { id: '3201', name: '南京市' },
    { id: '3205', name: '苏州市' },
    { id: '3202', name: '无锡市' },
    { id: '3211', name: '镇江市' },
    { id: '3212', name: '泰州市' },
    { id: '3213', name: '宿迁市' }
  ],
  '33': [ // 浙江省
    { id: '3301', name: '杭州市' },
    { id: '3302', name: '宁波市' },
    { id: '3303', name: '温州市' }
  ]
}

// 部分常用区县数据
export const districts: Record<string, Array<{id: string, name: string}>> = {
  '1101': [ // 北京市
    { id: '110101', name: '东城区' },
    { id: '110102', name: '西城区' },
    { id: '110105', name: '朝阳区' },
    { id: '110106', name: '丰台区' },
    { id: '110107', name: '石景山区' },
    { id: '110108', name: '海淀区' },
    { id: '110109', name: '门头沟区' },
    { id: '110111', name: '房山区' },
    { id: '110112', name: '通州区' },
    { id: '110113', name: '顺义区' },
    { id: '110114', name: '昌平区' },
    { id: '110115', name: '大兴区' },
    { id: '110116', name: '怀柔区' },
    { id: '110117', name: '平谷区' },
    { id: '110118', name: '密云区' },
    { id: '110119', name: '延庆区' }
  ],
  '3101': [ // 上海市
    { id: '310101', name: '黄浦区' },
    { id: '310104', name: '徐汇区' },
    { id: '310105', name: '长宁区' },
    { id: '310106', name: '静安区' },
    { id: '310107', name: '普陀区' },
    { id: '310109', name: '虹口区' },
    { id: '310110', name: '杨浦区' },
    { id: '310112', name: '闵行区' },
    { id: '310113', name: '宝山区' },
    { id: '310114', name: '嘉定区' },
    { id: '310115', name: '浦东新区' },
    { id: '310116', name: '金山区' },
    { id: '310117', name: '松江区' },
    { id: '310118', name: '青浦区' },
    { id: '310120', name: '奉贤区' },
    { id: '310151', name: '崇明区' }
  ],
  '4401': [ // 广州市
    { id: '440103', name: '荔湾区' },
    { id: '440104', name: '越秀区' },
    { id: '440105', name: '海珠区' },
    { id: '440106', name: '天河区' },
    { id: '440111', name: '白云区' },
    { id: '440112', name: '黄埔区' },
    { id: '440113', name: '番禺区' },
    { id: '440114', name: '花都区' },
    { id: '440115', name: '南沙区' },
    { id: '440117', name: '从化区' },
    { id: '440118', name: '增城区' }
  ],
  '4403': [ // 深圳市
    { id: '440303', name: '罗湖区' },
    { id: '440304', name: '福田区' },
    { id: '440305', name: '南山区' },
    { id: '440306', name: '宝安区' },
    { id: '440307', name: '龙岗区' },
    { id: '440308', name: '盐田区' },
    { id: '440309', name: '龙华区' },
    { id: '440310', name: '坪山区' },
    { id: '440311', name: '光明区' }
  ],
  '3301': [ // 杭州市
    { id: '330102', name: '上城区' },
    { id: '330103', name: '下城区' },
    { id: '330104', name: '江干区' },
    { id: '330105', name: '拱墅区' },
    { id: '330106', name: '西湖区' },
    { id: '330108', name: '滨江区' },
    { id: '330109', name: '萧山区' },
    { id: '330110', name: '余杭区' },
    { id: '330111', name: '富阳区' },
    { id: '330112', name: '临安区' }
  ]
} 