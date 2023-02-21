import './Loader.css'
import React from "react"
import { Spin } from 'antd';

const Loader = (props) => {
    return(
      <Spin className='spinner' spinning={props.isLoading}>
        {props.children}
      </Spin>
    )
}

export default Loader;