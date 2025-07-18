import React, { useRef, useState, useEffect } from 'react';

// component
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Asterisk from '@/components/asterisk';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Select from 'react-select';
import { MdOutlineAddPhotoAlternate } from 'react-icons/md';
import { Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Data
import { CategoryOptions, VariantsOptions, ColorOptions, SizeOptions } from '@/utils/data';

// type
import { VariantsData, OptionVariants, OptionSelected, RequestProduct, VariantTable } from '@/types';

export default function addproduct() {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [variants, setVariants] = useState<VariantsData[]>([]);
  const [optionVariant, setOptionVariant] = useState<OptionVariants[]>(VariantsOptions);
  const [optionSelected, setOptionSelected] = useState<OptionSelected[]>([{ option: [] }, { option: [] }]);
  const [variantTable, setVariantTable] = useState<VariantTable[]>([]);

  const [data, setData] = useState<RequestProduct>({
    productName: '',
    imageProduct: null,
    categoryName: '',
    description: '',
    status: '',
    options: [],
    variants: []
  });

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
    const dataVariant = [...variants, { variant: '', option: [] }]
    const dataVariantTable = [...variantTable, { Variant: '', detailVariant: [{ name: '', price: 0, quantity: 0, weight: 0, discount: 0, sku: '', isDeleted: false }] }]
    setVariants(dataVariant);
    setVariantTable(dataVariantTable);
  };

  const handleDeleteVariant = (index: number, value: string): void => {
    const updatedOptionVariant = optionVariant.map((variant) => {
      if(variant.value === value) {
        return {
          ...variant,
          isSelected: false,
        };
      }
      return variant;
    });

    const updatedVariants = variants.filter((_, i) => index !== i);
    setOptionVariant(updatedOptionVariant);
    setVariants(updatedVariants);
  };

  const handleChangeVariant = (index: number, e: OptionVariants | null): void => {
    if (!e) return;
    const isChecked = optionVariant.some((variant) => variant.isSelected);
    let data: OptionVariants[] = [];

    if (variants.length === 2 && isChecked) {
      data = optionVariant.map((variant) => {
        return {
          ...variant,
          isSelected: true,
        };
      })
    } else {
      data = optionVariant.map((variant) => {
        return {
          ...variant,
          isSelected: variant.value === e.value,
        };
      })
    }
    const newVariant = [...variants];
    newVariant[index] = { ...newVariant[index], variant: e.value };
    setVariants(newVariant);
    setOptionVariant(data);

    // const dataVariantTable = [...variantTable];
  }

  const handleFocus = (index: number) => {

    const isChecked = variants[index].variant === 'Color'

    const updated = [...optionSelected];
    updated[index] = { option: isChecked ? ColorOptions : SizeOptions };
    setOptionSelected(updated);
  };

  const handleChangeOption = (index: number, e: OptionVariants[] | null): void => {
    if (!e) return;

    let newOptions: string[] = []
    e.map((option: { value: string }) => {
      newOptions.push(option.value)
    })

    const newOption = [...variants];
    newOption[index] = { ...newOption[index], option: newOptions };
    setVariants(newOption);
  };

  const handleOptionVariant = () => {
    const option = optionVariant.filter((opt) => !opt.isSelected).map((opt) => {
      return {
        value: opt.value,
        label: opt.label,
        isSelected: false,
      }
    })
    return option;
  }
  // const handleVariantTable = () => {

  // };
  useEffect(() => {
    console.log('optionsvariants ==>', optionVariant);

  }, [optionVariant]);

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
                      value={ variant.variant ? { value: variant.variant, label: variant.variant, isSelected: true } : undefined}
                      name="variant"
                      options={handleOptionVariant()}
                      className="basic-single w-[400px]"
                      onChange={(e) => handleChangeVariant(index, e)}
                    />
                  </div>
                  <div className='flex flex-row gap-6'>
                    <Label className="font-bold self-center" htmlFor={`variant${index}`}>
                      Option {index + 1} <Asterisk />
                    </Label>
                    <Select
                      isMulti
                      name="option"
                      options={optionSelected && optionSelected[index].option}
                      className="basic-multi-select w-[400px]"
                      onChange={(e) => handleChangeOption(index, Array.from(e))}
                      onFocus={() => handleFocus(index)}
                      isDisabled={!variants[index].variant}
                    />
                  </div>
                </div>
                <Button variant='outline' onClick={() => handleDeleteVariant(index, variant.variant)} className="w-[50px]">
                  <Trash2 />
                </Button>
              </div>
            ))}
            {variants.length < 2 && (
              <Button onClick={() => handleAddVariant()} className="w-[150px]" disabled={!variants[0].variant}> + Add Variant</Button>
            )}
          </div>
        )}
        {variants.length > 0 && (<Table>
          <TableCaption>A list of your recent Variants.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Method</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Credit Card</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell>Credit Card</TableCell>
            </TableRow>
          </TableBody>
        </Table>)}
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
