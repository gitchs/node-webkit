import traceback
import time
import os
from selenium import webdriver
from platform import platform

script_dir = os.path.dirname(__file__)
path = os.path.join(script_dir,"..","..","tmp-nw","chromedriver2_server")
path = os.path.abspath(path)


driver = None
try:
    driver = webdriver.Chrome(path);
    driver.get('http://www.google.com');
    assert driver.title == 'Google'
    time.sleep(5) # Let the user actually see something!
    search_box = driver.find_element_by_name('q')
    search_box.send_keys('ChromeDriver')
    search_box.submit()
    time.sleep(5);
    title = str(driver.title[0:12])
    assert title == 'ChromeDriver'
except:
    traceback.print_exc()
else:
    print 'pass'
if driver is not None:
    driver.close()
