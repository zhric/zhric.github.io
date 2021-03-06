## 功能

动态地将 String 转换为 Date 对象。

## 使用

```java
// 先注册一些可能用到的日期 DateFormat
DateStrParser.regestDateParser("yyyy-MM-dd");
DateStrParser.regestDateParser("yyyyMMdd");

// 调用 DateFormat，得到 Date 对象
Date date1 = DateStrParser.parseToDate("2018-11-09");
Date date2 = DateStrParser.parseToDate("20181109");

```

## 原理

### 注册 DateFormat

* 根据传入字符串 pattern，生成一个 SimpleDateFormat 放入 一个 Map 中。

* Map 的 key: pattern 中 表示一个数字的 GyYMLwWDdFEuaHkKhmsS 等用于格式化的特殊字母全部替换为 0 后得到的字符串。传入 "yyyy-MM-dd"，则 key 为 "0000-00-00"；传入 "yyyyMMdd" 则 key 为 "00000000".



### 解析字符串

* 先将传入的 dateStr 中所有数字都替换为 0 得到能获取对应 SimpleDateFormat 的 key。传入 "2018-11-09" 得到 "0000-00-00"；传入 "20181109" 得到 "00000000"。

* 根据 key 从 Map 中获取 SimpleDateFormat 进行转化。

## 源码

```java
package com.ricbbs.core;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

/**
 * 字符串 => java.util.Date 转换工具类
 * @author Ric
 * @date 2018年5月24日
 */
public final class DateStrParser {

	/**
	 * 不可实例化
	 */
	private DateStrParser() {
	}

	/**
	 * key: GyYMLwWDdFEuaHkKhmsS 等用于格式化的特殊字母全部替换为 0 <br>
	 * 传入实际字符串查找对应转换器的时候需要将实际字符串的数字全替换为0
	 */
	private static Map<String, SimpleDateFormat> dateFormatMap = new ConcurrentHashMap<String, SimpleDateFormat>();

	/**
	 * 设置一个日期转换器
	 * @author Ric
	 * @param pattern 已包含：<br>
	 * 		yyyy-MM-dd <br>
	 * 		yyyyMMdd <br>
	 * 		HH:mm:ss <br>
	 * 		HHmmss <br>
	 * 		HH:mm:ss.SSS <br>
	 * 		HHmmssSSS <br>
	 * 		yyyy-MM-dd HH:mm:ss <br>
	 * 		yyyyMMddHHmmss <br>
	 * 		yyyy-MM-dd HH:mm:ss.SSS <br>
	 * 		yyyyMMddHHmmssSSS <br>
	 * 		yyyy-MM-dd'T'HH:mm:ss <br>
	 * 		yyyy-MM-dd'T'HH:mm:ssX <br>
	 * 		yyyy-MM-dd'T'HH:mm:ss.SSSX <br>
	 */
	public static void regestDateParser(String pattern) {
		Assert.hasText(pattern, "pattern can't be null.");
		if (pattern.contains("X")) {
			regestDateParser(pattern, pattern.replace("X", "+00:00"));
			regestDateParser(pattern, pattern.replace("X", "-00:00"));
			regestDateParser(pattern, pattern.replace("X", "'Z'"));
		} else {
			regestDateParser(pattern, pattern);
		}
	}

	/*
	 * 以下为内置的可解析日期 pattern
	 */
	static {

		// 年月日
		regestDateParser("yyyy-MM-dd");
		regestDateParser("yyyyMMdd");

		// 时分秒
		regestDateParser("HH:mm:ss");
		regestDateParser("HHmmss");
		regestDateParser("HH:mm:ss.SSS");
		regestDateParser("HHmmssSSS");

		// 完整时间戳
		regestDateParser("yyyy-MM-dd HH:mm:ss");
		regestDateParser("yyyyMMddHHmmss");
		regestDateParser("yyyy-MM-dd HH:mm:ss.SSS");
		regestDateParser("yyyyMMddHHmmssSSS");
		regestDateParser("yyyy-MM-dd'T'HH:mm:ss");

		// 完整时间戳带时区
		regestDateParser("yyyy-MM-dd'T'HH:mm:ssX");
		regestDateParser("yyyy-MM-dd'T'HH:mm:ss.SSSX");
	}

	/**
	 * 解析字符串
	 * @author Ric
	 * @param dateStr
	 * @return
	 * @throws ParseException
	 */
	public static java.util.Date parseToDate(String dateStr) throws ParseException {
		if (!StringUtils.hasText(dateStr)) {
			return null;
		}
		String key = dateStr.replaceAll("\\d", "0");
		SimpleDateFormat simpleDateFormat = dateFormatMap.get(key);
		Assert.notNull(simpleDateFormat, "can't find format for this date string: " + dateStr);
		return simpleDateFormat.parse(dateStr);
	}

	private static void regestDateParser(String pattern, String example) {
		String[] split = example.split("'");
		boolean s = false;
		String key = "";
		for (String string : split) {
			if (s) {
				key += string;
			} else {
				key += string.replaceAll("[GyYMLwWDdFEuaHkKhmsS]", "0");
			}
			s = !s;
		}
		dateFormatMap.put(key, new SimpleDateFormat(pattern));
	}
}
```
