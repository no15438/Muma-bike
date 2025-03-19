'use client';

import React, { useState } from 'react';
import { withAuth } from '@/lib/auth/auth-context';
import { Permission } from '@/lib/auth/permissions';
import {
  Cog6ToothIcon,
  BuildingStorefrontIcon,
  UserIcon,
  BellIcon,
  TruckIcon,
  CurrencyYenIcon,
} from '@heroicons/react/24/outline';

function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [storeSettings, setStoreSettings] = useState({
    storeName: '牧马单车',
    storeAddress: '北京市海淀区中关村大街1号',
    storePhone: '010-12345678',
    storeEmail: 'contact@mumabike.com',
    businessHours: '周一至周日 9:00-18:00',
    description: '专业自行车销售与维修',
  });
  const [notificationSettings, setNotificationSettings] = useState({
    orderNotifications: true,
    repairNotifications: true,
    inventoryAlerts: true,
    emailNotifications: true,
    smsNotifications: false,
  });
  const [paymentSettings, setPaymentSettings] = useState({
    acceptCash: true,
    acceptWeChat: true,
    acceptAlipay: true,
    acceptCreditCard: true,
    weChatMerchantId: 'wx123456789',
    alipayMerchantId: 'ali987654321',
  });
  const [deliverySettings, setDeliverySettings] = useState({
    enableFreeShipping: true,
    freeShippingThreshold: 500,
    defaultShippingFee: 20,
    supportPickup: true,
    supportExpress: true,
    expressCompanies: '顺丰速运,圆通速递,中通快递,申通快递,韵达快递',
  });
  const [saving, setSaving] = useState(false);

  // 处理表单变更
  const handleStoreChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStoreSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    setPaymentSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDeliveryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type, value, checked } = e.target;
    setDeliverySettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // 处理保存设置
  const handleSave = async () => {
    setSaving(true);
    try {
      // 在实际应用中，这里会调用API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 成功消息
      alert('设置已保存');
    } catch (error) {
      console.error('Failed to save settings:', error);
      
      // 错误消息
      alert('保存设置失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  // 选项卡内容
  const tabContent = {
    general: (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">店铺信息</h3>
          <p className="mt-1 text-sm text-gray-500">设置您的店铺基本信息</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
              店铺名称
            </label>
            <input
              type="text"
              id="storeName"
              name="storeName"
              value={storeSettings.storeName}
              onChange={handleStoreChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="storePhone" className="block text-sm font-medium text-gray-700">
              联系电话
            </label>
            <input
              type="text"
              id="storePhone"
              name="storePhone"
              value={storeSettings.storePhone}
              onChange={handleStoreChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="storeEmail" className="block text-sm font-medium text-gray-700">
              邮箱地址
            </label>
            <input
              type="email"
              id="storeEmail"
              name="storeEmail"
              value={storeSettings.storeEmail}
              onChange={handleStoreChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="businessHours" className="block text-sm font-medium text-gray-700">
              营业时间
            </label>
            <input
              type="text"
              id="businessHours"
              name="businessHours"
              value={storeSettings.businessHours}
              onChange={handleStoreChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="storeAddress" className="block text-sm font-medium text-gray-700">
              店铺地址
            </label>
            <input
              type="text"
              id="storeAddress"
              name="storeAddress"
              value={storeSettings.storeAddress}
              onChange={handleStoreChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              店铺描述
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={storeSettings.description}
              onChange={handleStoreChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
    ),
    notifications: (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">通知设置</h3>
          <p className="mt-1 text-sm text-gray-500">配置系统通知和提醒</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="orderNotifications"
                name="orderNotifications"
                type="checkbox"
                checked={notificationSettings.orderNotifications}
                onChange={handleNotificationChange}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="orderNotifications" className="font-medium text-gray-700">订单通知</label>
              <p className="text-gray-500">接收新订单和订单状态变更的通知</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="repairNotifications"
                name="repairNotifications"
                type="checkbox"
                checked={notificationSettings.repairNotifications}
                onChange={handleNotificationChange}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="repairNotifications" className="font-medium text-gray-700">维修通知</label>
              <p className="text-gray-500">接收新维修单和维修状态变更的通知</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="inventoryAlerts"
                name="inventoryAlerts"
                type="checkbox"
                checked={notificationSettings.inventoryAlerts}
                onChange={handleNotificationChange}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="inventoryAlerts" className="font-medium text-gray-700">库存警报</label>
              <p className="text-gray-500">当库存低于阈值时接收通知</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-900">通知方式</h4>
          <div className="mt-4 space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="emailNotifications"
                  name="emailNotifications"
                  type="checkbox"
                  checked={notificationSettings.emailNotifications}
                  onChange={handleNotificationChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="emailNotifications" className="font-medium text-gray-700">邮件通知</label>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="smsNotifications"
                  name="smsNotifications"
                  type="checkbox"
                  checked={notificationSettings.smsNotifications}
                  onChange={handleNotificationChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="smsNotifications" className="font-medium text-gray-700">短信通知</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    payment: (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">支付设置</h3>
          <p className="mt-1 text-sm text-gray-500">配置支付方式和支付接口</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="acceptCash"
                name="acceptCash"
                type="checkbox"
                checked={paymentSettings.acceptCash}
                onChange={handlePaymentChange}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="acceptCash" className="font-medium text-gray-700">现金支付</label>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="acceptWeChat"
                name="acceptWeChat"
                type="checkbox"
                checked={paymentSettings.acceptWeChat}
                onChange={handlePaymentChange}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="acceptWeChat" className="font-medium text-gray-700">微信支付</label>
            </div>
          </div>
          
          {paymentSettings.acceptWeChat && (
            <div className="ml-8">
              <label htmlFor="weChatMerchantId" className="block text-sm font-medium text-gray-700">
                微信商户号
              </label>
              <input
                type="text"
                id="weChatMerchantId"
                name="weChatMerchantId"
                value={paymentSettings.weChatMerchantId}
                onChange={handlePaymentChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          )}
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="acceptAlipay"
                name="acceptAlipay"
                type="checkbox"
                checked={paymentSettings.acceptAlipay}
                onChange={handlePaymentChange}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="acceptAlipay" className="font-medium text-gray-700">支付宝</label>
            </div>
          </div>
          
          {paymentSettings.acceptAlipay && (
            <div className="ml-8">
              <label htmlFor="alipayMerchantId" className="block text-sm font-medium text-gray-700">
                支付宝商户号
              </label>
              <input
                type="text"
                id="alipayMerchantId"
                name="alipayMerchantId"
                value={paymentSettings.alipayMerchantId}
                onChange={handlePaymentChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          )}
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="acceptCreditCard"
                name="acceptCreditCard"
                type="checkbox"
                checked={paymentSettings.acceptCreditCard}
                onChange={handlePaymentChange}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="acceptCreditCard" className="font-medium text-gray-700">银行卡支付</label>
            </div>
          </div>
        </div>
      </div>
    ),
    delivery: (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">配送设置</h3>
          <p className="mt-1 text-sm text-gray-500">配置配送方式和费用</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="enableFreeShipping"
                name="enableFreeShipping"
                type="checkbox"
                checked={deliverySettings.enableFreeShipping}
                onChange={handleDeliveryChange}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="enableFreeShipping" className="font-medium text-gray-700">启用免费配送</label>
              <p className="text-gray-500">当订单金额达到阈值时提供免费配送</p>
            </div>
          </div>
          
          {deliverySettings.enableFreeShipping && (
            <div className="ml-8">
              <label htmlFor="freeShippingThreshold" className="block text-sm font-medium text-gray-700">
                免费配送金额阈值 (元)
              </label>
              <input
                type="number"
                id="freeShippingThreshold"
                name="freeShippingThreshold"
                value={deliverySettings.freeShippingThreshold}
                onChange={handleDeliveryChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          )}
          
          <div>
            <label htmlFor="defaultShippingFee" className="block text-sm font-medium text-gray-700">
              默认配送费 (元)
            </label>
            <input
              type="number"
              id="defaultShippingFee"
              name="defaultShippingFee"
              value={deliverySettings.defaultShippingFee}
              onChange={handleDeliveryChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="supportPickup"
                name="supportPickup"
                type="checkbox"
                checked={deliverySettings.supportPickup}
                onChange={handleDeliveryChange}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="supportPickup" className="font-medium text-gray-700">支持到店自提</label>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="supportExpress"
                name="supportExpress"
                type="checkbox"
                checked={deliverySettings.supportExpress}
                onChange={handleDeliveryChange}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="supportExpress" className="font-medium text-gray-700">支持快递配送</label>
            </div>
          </div>
          
          {deliverySettings.supportExpress && (
            <div className="ml-8">
              <label htmlFor="expressCompanies" className="block text-sm font-medium text-gray-700">
                支持的快递公司 (用逗号分隔)
              </label>
              <textarea
                id="expressCompanies"
                name="expressCompanies"
                rows={2}
                value={deliverySettings.expressCompanies}
                onChange={handleDeliveryChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          )}
        </div>
      </div>
    )
  };

  // 选项卡配置
  const tabs = [
    { id: 'general', name: '基本设置', icon: BuildingStorefrontIcon },
    { id: 'notifications', name: '通知设置', icon: BellIcon },
    { id: 'payment', name: '支付设置', icon: CurrencyYenIcon },
    { id: 'delivery', name: '配送设置', icon: TruckIcon },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">系统设置</h1>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                <div className="flex flex-col items-center">
                  <tab.icon className="h-5 w-5 mb-1" aria-hidden="true" />
                  {tab.name}
                </div>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {tabContent[activeTab as keyof typeof tabContent]}

          <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  保存中...
                </>
              ) : (
                '保存设置'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(SettingsPage, Permission.MANAGE_SETTINGS); 