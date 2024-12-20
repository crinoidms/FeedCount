const { useState } = React;

// 費用設定
const fees = {
  regular: {
    credit: 3000,
    aircon: 200,
    insurance: 200,
    registration: 200,
  },
  short: {
    credit: 1000,
    aircon: 100,
    insurance: 100,
    registration: 100,
  }
};

// 優惠選項
const discountOptions = [
  { 
    id: 'free', 
    label: '免費',
    shortLabel: '免費',
    value: 0,
    description: [
      '• 滿80歲以上之學員',
      '• 中山社大上學期服務滿100小時之志工(免費上一門課)'
    ]
  },
  { 
    id: '50off', 
    label: '5折優惠',
    shortLabel: '5折',
    value: 0.5,
    description: [
      '• 滿75歲以上之學員',
      '• 中山社大上學期服務滿54小時之志工',
      '• 新移民(限東南亞籍)憑證明',
      '• 身心障礙人士(持有身心障礙手冊)',
      '• 低收入戶(生活輔導戶)',
      '• 稻江護家現任教職員工',
      '• 中山社大教職員工',
      '• 中山區里長、里幹事、本市議員',
      '• 原住民(戶籍謄本)',
      '• 中山社大累計學習15年學員(限折扣1門)'
    ]
  },
  { 
    id: '80off', 
    label: '8折優惠',
    shortLabel: '8折',
    value: 0.8,
    description: [
      '• 滿70歲以上之學員',
      '• 擔任中山社大112春季班當期班代、副班代(限兩門課)',
      '• 新課程8折(簡章有標NEW)',
      '• 中山社大上學期服務滿36小時之志工',
      '• 鄰長、社區發展協會理事長、現任正式立案之社團負責人',
      '• 非自願性離職待業者(離職證明以112年1月1日以後為限)',
      '• 稻江護家退休教職員工'
    ]
  },
  { 
    id: '90off', 
    label: '9折優惠',
    shortLabel: '9折',
    value: 0.9,
    description: [
      '• 滿65歲以上之學員',
      '• <span style="color: #047857">113秋季班當期學員於(113/12/16~12/21)報名者</span>',
      '• <span style="color: #047857">新生、他期舊生於(113/12/22~12/29)報名特惠期</span>',
      '• 本學期選讀3門課程，第3門享優惠',
      '• 臺北市、新北市政府所轄教職員工',
      '• 夫妻同修、二代、三代同修',
      '• 中山社大上學期服務滿18小時之志工',
      '• 中山區各公私立機關、學校、團體服務滿36小時之志工'
    ]
  },
  { 
    id: '95off', 
    label: '95折優惠',
    shortLabel: '95折',
    value: 0.95,
    description: [
      '• 舊生於(113/12/29)以後報名者',
      '• 本學期選讀一般課程，第2門享優惠',
      '• 稻江護家畢業校友'
    ]
  }
];

// 折價券選項
const couponOptions = [
  { id: '100', label: '100元折價券', value: 100 },
  { id: '200', label: '200元折價券', value: 200 }
];

function FeeCalculator() {
  const [formData, setFormData] = useState({
    semester: 'regular',
    isGroupRegistration: true,
    selectedDiscount: '90off',
    coupon: '',
    noInsurance: false,
  });

  const [fontSize, setFontSize] = useState(14);

  const handleCheckboxChange = (name, checked) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked,
      selectedDiscount: name === 'isGroupRegistration' && checked ? '90off' : prev.selectedDiscount
    }));
  };

  const calculateTotal = () => {
    const currentFees = fees[formData.semester];
    let total = 0;
    
    const discountValue = discountOptions.find(opt => opt.id === formData.selectedDiscount)?.value ?? 1;
    total += currentFees.credit * discountValue;
    
    total += currentFees.aircon;
    total += formData.noInsurance ? 0 : currentFees.insurance;
    total += formData.isGroupRegistration ? 0 : currentFees.registration;
    
    if (discountValue !== 0 && formData.coupon) {
      const couponValue = couponOptions.find(c => c.id === formData.coupon)?.value || 0;
      total -= couponValue;
    }
    
    return Math.max(0, Math.round(total));
  };

  const getActiveDiscounts = () => {
    const discounts = [];
    
    if (formData.isGroupRegistration) {
      discounts.push('團報優惠（免報名費）');
    }
    
    if (formData.noInsurance) {
      discounts.push('免保險費（已在其他社大投保）');
    }
    
    if (formData.selectedDiscount) {
      const discount = discountOptions.find(d => d.id === formData.selectedDiscount);
      if (discount) {
        discounts.push(discount.label);
      }
    }
    
    if (formData.coupon && formData.selectedDiscount !== 'free') {
      const coupon = couponOptions.find(c => c.id === formData.coupon);
      if (coupon) {
        discounts.push(coupon.label);
      }
    }
    
    return discounts;
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h1 className="text-lg font-bold text-center">中山社大學費計算器</h1>
        </div>
        
        <div className="p-4 space-y-6">
          {/* 團報週開關 */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">團報週</div>
              <div className="text-sm text-gray-500">團報週期間：113/12/16~12/21</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isGroupRegistration}
                onChange={(e) => handleCheckboxChange('isGroupRegistration', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* 班別選擇 */}
          <div className="space-y-2">
            <div className="font-medium">選擇班別</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'regular', label: '春秋季班' },
                { id: 'short', label: '寒暑假班' }
              ].map(option => (
                <button
                  key={option.id}
                  onClick={() => setFormData(prev => ({ ...prev, semester: option.id }))}
                  className={`
                    px-4 py-2 rounded-lg text-sm relative pl-8
                    ${formData.semester === option.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100'
                    }
                  `}
                >
                  {formData.semester === option.id && (
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2">✓</span>
                  )}
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 優惠選擇 */}
          <div className="space-y-3">
            <div className="font-medium">選擇優惠</div>
            <div className="flex flex-wrap gap-2">
              {discountOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => 
                    setFormData(prev => ({
                      ...prev,
                      selectedDiscount: prev.selectedDiscount === option.id ? '' : option.id,
                      coupon: option.id === 'free' ? '' : prev.coupon
                    }))
                  }
                  className={`
                    px-4 py-2 rounded-lg text-sm relative pl-8
                    ${formData.selectedDiscount === option.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100'
                    }
                  `}
                >
                  {formData.selectedDiscount === option.id && (
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2">✓</span>
                  )}
                  <span>{option.shortLabel}</span>
                </button>
              ))}
            </div>

            {/* 優惠說明 */}
            {formData.selectedDiscount && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg text-gray-600" style={{ fontSize: `${fontSize}px` }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">
                    {discountOptions.find(opt => opt.id === formData.selectedDiscount)?.label}適用對象：
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setFontSize(prev => Math.max(prev - 2, 12))}
                      className="px-2 py-1 rounded bg-gray-200 text-sm"
                    >
                      A-
                    </button>
                    <button 
                      onClick={() => setFontSize(prev => Math.min(prev + 2, 20))}
                      className="px-2 py-1 rounded bg-gray-200 text-sm"
                    >
                      A+
                    </button>
                  </div>
                </div>
                {discountOptions.find(opt => opt.id === formData.selectedDiscount)?.description.map((line, index) => (
                  <div key={index} className="ml-2" dangerouslySetInnerHTML={{ __html: line }}></div>
                ))}
              </div>
            )}
          </div>

          {/* 折價券選擇 */}
          <div className="space-y-2">
            <div className="font-medium">
              折價券
              {formData.selectedDiscount === 'free' && (
                <span className="text-sm text-gray-500 ml-2">(免費不適用)</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {couponOptions.map(option => (
                <button
                  key={option.id}
                  disabled={formData.selectedDiscount === 'free'}
                  onClick={() => 
                    setFormData(prev => ({
                      ...prev,
                      coupon: prev.coupon === option.id ? '' : option.id
                    }))
                  }
                  className={`
                    px-4 py-2 rounded-lg text-sm relative pl-8
                    ${formData.selectedDiscount === 'free'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : formData.coupon === option.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100'
                    }
                  `}
                >
                  {formData.coupon === option.id && (
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2">✓</span>
                  )}
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 免保險費選擇 */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">免保險費</div>
              <div className="text-sm text-gray-500">已報名其他課程或其他社大</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                checked={formData.noInsurance}
                onChange={(e) => handleCheckboxChange('noInsurance', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* 費用顯示 */}
          <div className="mt-6 p-4 bg-emerald-50 rounded-lg space-y-4">
            {/* 總計費用 */}
            <div className="text-xl font-bold text-emerald-600">
              總計費用：NT$ {calculateTotal()}
            </div>

            {/* 費用明細和優惠列表並排 */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t text-sm">
              {/* 費用明細 */}
              <div className="space-y-1">
                <div className="font-medium mb-2">費用明細：</div>
                <div>學分費：{fees[formData.semester].credit * (discountOptions.find(opt => opt.id === formData.selectedDiscount)?.value ?? 1)}</div>
                <div>冷氣費：{fees[formData.semester].aircon}</div>
                <div>保險費：{formData.noInsurance ? 0 : fees[formData.semester].insurance}</div>
                <div>報名費：{formData.isGroupRegistration ? 0 : fees[formData.semester].registration}</div>
                {formData.coupon && formData.selectedDiscount !== 'free' && (
                  <div>折價券：-{couponOptions.find(c => c.id === formData.coupon)?.value || 0}</div>
                )}
              </div>

              {/* 優惠說明列表 */}
              {getActiveDiscounts().length > 0 && (
                <div className="space-y-1">
                  <div className="font-medium mb-2">採用優惠：</div>
                  {getActiveDiscounts().map((discount, index) => (
                    <div key={index} className="text-gray-600">• {discount}</div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 相關連結 */}
          <div className="mt-4 pt-4 border-t flex gap-4 justify-center">
            <a 
              href="https://zscc.twcu.org.tw/course/php/bulletin_c_show.php?u=640eb556acda1" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline flex items-center"
            >
              查看報名辦法
            </a>
            <a 
              href="https://zscc.twcu.org.tw/course/php/bulletin_c_show.php?u=640ec4bb651e1" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline flex items-center"
            >
              查看優惠辦法
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// 渲染應用
ReactDOM.render(<FeeCalculator />, document.getElementById('root'));
