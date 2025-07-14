import React, { useEffect, useState } from 'react';

// component
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Asterisk from '@/components/asterisk';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Select from 'react-select';
import { MdOutlineAddPhotoAlternate } from 'react-icons/md';
import { Trash2 } from 'lucide-react';

// Data
import { CategoryOptions, VariantsOptions, ColorOptions, SizeOptions } from '@/utils/data';

// type
import { Variants, OptionVariants } from '@/types';

export default function addproduct() {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [variants, setVariants] = useState<Variants[]>([]);
  const [optionVariant, setOptionVariant] = useState<OptionVariants[]>(VariantsOptions);

  const handleChangePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (images.length + files.length > 3) {
      alert('You can only upload up to 3 images.');
      return;
    }

    const selectedFiles = Array.from(files).slice(0, 3);
    setImages(selectedFiles);
    let DataImages = [...images];
    if (selectedFiles.length > 0) {
      selectedFiles.forEach((file) => {
        DataImages.push(file);
      });
    }
    setImages(DataImages);
    const previewUrls = DataImages.map((file) => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  const handleAddVariant = (): void => {
    if (variants.length == 2) {
      return;
    }
    setVariants([...variants, { variant: '', option: '' }]);
  };

  const handleDeleteVariant = (index: number): void => {
    console.log('Deleting index:', index);
    const updatedVariants = variants.filter((_, i) => index !== i);
    console.log('Updated variants:', updatedVariants);
    setVariants(updatedVariants);
  };

  const handleChangeVariant = (e: OptionVariants | null): void => {
    if (!e) return;
    let data: OptionVariants[] = [];
    if (variants.length === 1) {
      data = optionVariant.map((variant) => {
        return {
          ...variant,
          isSelected: variant.value === e.value,
        };
      })
    }

    if (variants.length === 2) {
      data = optionVariant.map((variant) => {
        return {
          ...variant,
          isSelected: true,
        };
      })
    }
    setOptionVariant(data);
  }

  const handleOption = (index: number) => {
    const isFiltered = optionVariant.filter((option) => option.isSelected).some(opt => opt.value === 'Color')
    let data ;
    if (index === 0) {
      data = isFiltered ? ColorOptions : SizeOptions
      return data;
    }
    if (index === 1) {
      data = isFiltered ? SizeOptions : ColorOptions
      return data;
    }

  };

  return (
    <div className="p-4">
      <p className="text-4xl font-bold mb-10">Add Your Product</p>
      <div className="flex flex-col gap-6">
        <div className="flex flex-row justify-between items-center">
          <Label className="font-bold" htmlFor="product's name">
            Product's Name <Asterisk />
          </Label>
          <Input className="w-[900px]" id="product's name" placeholder="Product's Name" />
        </div>
        <div className="flex flex-row justify-between items-center">
          <Label className="font-bold" htmlFor="Category">
            Category <Asterisk />
          </Label>
          <Select className="w-[900px]" options={CategoryOptions} />
        </div>
        <div className="flex items-start mt-[-15px] flex-row">
          <Label className="font-bold mt-5" htmlFor="photoProduct">
            Photo Product <Asterisk />
          </Label>
          <div className="flex ml-[105px]">
            <div className="flex gap-2 mt-4">
              {previews.map((src, index) => (
                <img
                  className="w-24 h-24 object-cover border rounded-md"
                  key={index}
                  src={src}
                  alt={`Preview ${index + 1}`}
                />
              ))}
              <div className="relative">
                <div className="flex flex-col justify-center items-center gap-3 w-24 h-24 cursor-pointer border border-dashed border-gray-400 rounded-md absolute top-0">
                  <MdOutlineAddPhotoAlternate className="text-4xl" />
                  <p className="text-[10px]">{`Add Photo (${images.length}/3)`}</p>
                </div>
                <input
                  className="w-24 h-24 cursor-pointer opacity-0"
                  type="file"
                  accept="image/png, image/jpeg"
                  multiple
                  onChange={handleChangePhoto}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-between">
          <Label className="font-bold" htmlFor="Description">
            Description <Asterisk />
          </Label>
          <Textarea className="w-[900px] h-[200px]" id="Description" placeholder="Description" />
        </div>
        {variants.length === 0 && (<div className="flex flex-row justify-between items-center">
          <div>
            <Label className="font-bold" htmlFor="variant">
              Product's Variant
            </Label>
            <p className="text-sm">
              Add up to 2 variant types to let customers choose the product that suits them best.
            </p>
          </div>
          <Button onClick={() => handleAddVariant()} className="w-[200px]"> + Add Variant</Button>
        </div>)}
        {variants.length > 0 && (
          <div className="flex flex-col gap-6">
            {variants.map((variant, index) => (
              <div key={index} className="flex flex-row justify-start items-center gap-6">
                <div className="flex flex-row gap-6">
                  <div className='flex flex-row gap-6'>
                    <Label className="font-bold self-center" htmlFor={`variant${index}`}>
                      Variant {index + 1} <Asterisk />
                    </Label>
                    <Select
                      name="variant"
                      options={optionVariant.filter((option) => !option.isSelected)}
                      className="basic-single w-[400px]"
                      onChange={(e) => handleChangeVariant(e)}
                    />
                  </div>
                  <div className='flex flex-row gap-6'>
                    <Label className="font-bold self-center" htmlFor={`variant${index}`}>
                      Option {index + 1} <Asterisk />
                    </Label>
                    <Select
                      isMulti
                      name="option" 
                      options={handleOption(index) || []}
                      className="basic-multi-select w-[400px]" />
                  </div>
                </div>
                <Button variant='outline' onClick={() => handleDeleteVariant(index)} className="w-[50px]">
                  <Trash2 />
                </Button>
              </div>
            ))}
            {variants.length < 2 && (
              <Button onClick={() => handleAddVariant()} className="w-[150px]"> + Add Variant</Button>
            )}
          </div>
        )}
        {variants.length === 0 && (<div className='flex flex-col gap-6'>
          <div className="flex flex-row justify-between items-center">
            <Label className="font-bold" htmlFor="Price">
              Price <Asterisk />
            </Label>
            <Input className="w-[900px]" id="Price" placeholder="IDR" />
          </div>
          <div className="flex flex-row justify-between items-center">
            <Label className="font-bold" htmlFor="Quantity">
              Quantity <Asterisk />
            </Label>
            <Input className="w-[900px]" id="Quantity" placeholder="Quantity" />
          </div>
          <div className="flex flex-row justify-between items-center">
            <Label className="font-bold" htmlFor="SKU">
              SKU <Asterisk />
            </Label>
            <Input className="w-[900px]" id="SKU" placeholder="SKU" />
          </div>
          <div className="flex flex-row justify-between items-center">
            <Label className="font-bold" htmlFor="Weight">
              Weight <Asterisk />
            </Label>
            <Input className="w-[900px]" id="Weight" placeholder="grams" />
          </div>
          <div className="flex flex-row justify-between items-center">
            <Label className="font-bold" htmlFor="Discount">
              Discount
            </Label>
            <Input className="w-[900px]" id="Discount" placeholder="IDR" />
          </div>
        </div>)}
      </div>
      <div className="flex justify-end gap-4">
        <Button className="w-[200px] mt-10">Create Product</Button>
      </div>
    </div>
  );
}
