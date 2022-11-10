import React from "react";
import Checkbox from "../../../components/Checkbox/CheckboxWithLabel";
import filterPic from './filterIcon.png'
import "./style.css";


const FilterBox = (props) => {

    return (
        <div className="filter-box">
            <div className="filter-title-box">
                <img className="filter-img" src={filterPic}></img>
                <span className="filter-title">Filter</span>
            </div>
            <div className="inner-filter-box">
                <ul className="list-layout-filter">
                    <li className="list-item-title-filter">
                        <span >By Role</span>
                        
                    </li>
                    <li className="list-item-element-filter">
                        <Checkbox label="Professor"></Checkbox>
                    </li>
                    <li className="list-item-element-filter">
                        <Checkbox label="TA"></Checkbox>
                    </li>
                    <li className="list-item-element-filter">
                        <Checkbox label="Student"></Checkbox>
                    </li>
                    <li className="list-item-title-filter">
                        <span>By Type</span>
                    </li>
                    <li className="list-item-element-filter">
                        <Checkbox label="Message"></Checkbox>
                    </li>
                    <li className="list-item-element-filter">
                        <Checkbox label="Poll"></Checkbox>
                    </li>
                </ul>
            </div>
        </div>
    );

}

export default FilterBox;